var user = require('../db/mongo').user;
var stack = require('../db/mongo').stack;
var testB = require('../db/mongo').testB;
var q = require('q');
var jwt = require('jsonwebtoken');
var key = require('../config.json');
var expires = require('../config.json').expires;
var stackService = require('./stackService');
var testService = require('./testService');
var async = require('async');
var userAs = require('../db/mongo').userAs;
var stackAs = require('../db/mongo').stackAs;
var resultsAs = require('../db/mongo').resultsAs;

function getAllUsers(){
	return user.find({},{},{});
}
function getAllRole(_role){
	return user.find({role: _role},{'_id':1,'firstName': 1, 'lastName':1, 'email':1, 'number':1},{});
}	
function userInfo(id){
    return user.findOne({_id: id},{},{});
}
function addNewUser(info){
	return user.save(info);	
}
function addNewUsers(info){
    return user.create(info); 
}
function removeCollection(query){
    return user.remove(query);
}
function find(query, fields, options){
    return user.find(query, fields, options);
}
function update(query, update,options){
    return user.update(query, update,options);
}
function authenticate(email, pass){
    var defer = q.defer();
    user.findOne({email: email},{},{}).then(function(user_){                
        if (!user_) {           
            defer.reject();
        } else {
            user_.comparePassword(pass, function(err, isMatch) {
                if (isMatch && !err) {
                    var user = {};
                    user.email = user_.email;
                    user.role = user_.role;
                    //user.password = user_.password;
                    user.firstName = user_.firstName;
                    user.lastName = user_.lastName;
                    user._id = user_._id;

                    var token = jwt.sign(user, key.secret, {
                        expiresIn: expires 
                    });
                    
                    var refreshToken = jwt.sign(user, key.refreshsecret, {
                        expiresIn: expires 
                    });

                    var now = new Date;
                    now.setSeconds(now.getSeconds() + expires);
                    var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
                    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

                    if(user.role == 'guest'){
                        stackService.findOpenTests({userId: user._id},{},{}).then(function(data){
                            if(data.length){
                                defer.resolve({ user : user, token: 'JWT ' + token, refreshToken: refreshToken, expiredTime: utc_timestamp});
                            }
                            else{
                                defer.reject();
                            }
                        }).catch(function(err){
                            defer.reject();
                        });
                    }else{
                        defer.resolve({ user : user, token: 'JWT ' + token, refreshToken: refreshToken, expiredTime: utc_timestamp});
                    }
                } else {
                    defer.reject();
                }
            });
        }
	}).catch(function(err){
		defer.reject(err);
	});

    return defer.promise;
}


function getUserStatus(_userId){
    var pr = q.defer();
    userInfo(_userId).then(function(data){
        stackService.findOneOpenTests({userId: _userId},{},{}).then(function(data){
            if(data){
                var now = new Date().getTime();
                if(now < data.dateStart){
                    pr.resolve({status:'open',dateStart: data.dateStart, dateEnd: data.dateEnd });
                }
                if(now >= data.dateStart && now<= data.dateEnd){
                    pr.resolve({status:'scha',dateStart: data.dateStart, dateEnd: data.dateEnd });
                 }
                if(now > data.dateEnd ) {
                    console.log('BAD TIME');
                    stackService.removeOpenTestsCollection({userId: _userId}).then(function(data){
                        updateStatus(_userId,'free');
                        pr.resolve({status:'free'});

                    }).catch(function(err){
                        pr.reject(err);
                    });
                    
                 }
            }                
            else 
                stackService.findRequest({userId: _userId},{},{}).then(function(data){
                    if(data.length != 0){
                        
                        pr.resolve({status: 'req'});
                    }                         
                    else 
                        stackService.findStack({userId: _userId},{},{}).then(function(data){
                             if(data.length != 0){
                                    
                                    pr.resolve({status:'stack'}); 
                             }else {
                                 
                                 pr.resolve({status:'free'});
                             }  
                        }).catch(function (err){
                            pr.reject(err);
                        });
                    }).catch(function (err) {
                        pr.reject(err);
                    });           
                }).catch(function (err) {
                    pr.reject(err);
                });                                     
    }).catch(function(err){
        console.log('User NOT FOUND');
        pr.reject(err);
    });

    return pr.promise;
    
}

function getFinishedList(flag,options,reg){
    var defer = q.defer();
    stackService.findStack({teacherId:'none'},{'userId': 1,'answers':1},{}).then(function (data) {
        var noobsId =[];
        var arrayId =[];
        data.forEach(function(element){ 
            if(element._doc.answers.length == 0){
                noobsId.push(element._doc.userId);      
            }
            else{
                arrayId.push(element._doc.userId);
               ;
            }
        });
       
        stackService.removeStackCollection({userId : {$in : noobsId}}).then(function(data){
            update({_id : {$in:noobsId}},{ $set: { status: 'free' }},{multi: true}).then(function(data){
               
                
                if(flag == true){
                    user.find({'_id': {$in:arrayId},$or:[{'firstName': new RegExp(reg, "i")},{'lastName': new RegExp(reg, "i")},{'email': new RegExp(reg, "i")}]},options,{}).then(function (data_) {
                        defer.resolve(data_);
                    }).catch(function (err) {
                        defer.reject(err);
                    });
                }
                else {
                    user.find({'_id': {$in:arrayId}},options,{}).then(function (data_) {
                        defer.resolve(data_);
                    }).catch(function (err) {
                        defer.reject(err);
                    });
                }
            }).catch(function(err){
                defer.reject(err);
            });

            
        }).catch(function(err){
            defer.reject(err);
        });
        
    }).catch(function (err) {
        defer.reject(err);
    });
    return defer.promise;
}
//----------------------------------------
function submitDemo(data, id){
    var defer = q.defer();

    stackService.checkFirstPartDemo(data, id).then(function(level){   
        
            defer.resolve();
    }).catch(function(err){
        defer.reject(err);
    })
    return defer.promise;
}


//------------------------------


function submit1(data, id){
    var defer = q.defer();

    stackService.checkFirstPart(data, id).then(function(level){     
        testService.getSecondTest(level).then(function(data){
            defer.resolve(data);
        }).catch(function(err){
            defer.reject(err);
        })
    }).catch(function(err){
        defer.reject(err);
    })
    return defer.promise;
}

function submit2(data, uid){
    var defer = q.defer();
    console.log(data);
    data.forEach(function(element) {
        if(element.badForUser){
            testB.update({_id:element.qId},{ $set: { complaint: true }},{});
        }
    });

    stack.update({userId:uid},{ $set: { answers: data }},{}).then(function(data){
        updateStatus(uid,'stack');
        defer.resolve(data);
    }).catch(function(err){
        defer.reject(err);
    })

    return defer.promise;
}

function updateStatus(id,_status){
   update({_id:id},{ $set: { status: _status }},{}).then(function(data){
                  //      console.log('user update')
                    }).catch(function(err){
                    //   console.log(err);
                    });
}
function getTeacherStatus(_tId){
    var pr = q.defer();
    userInfo(_tId).then(function(data){
        if(data){
            stackService.resultsCount({teacherId:_tId}).then(function(data){
                   // console.log(data);
                    stackService.stackCount({teacherId:_tId}).then(function(data2){
                        pr.resolve({totalTests: data, assignTest: data2})
                    }).catch(function(err){
                        pr.reject(err);
                    });
            }).catch(function(err){
                pr.reject(err);
            });
        }
        else{
             pr.reject('teacher not found');
        }
                                 
    }).catch(function(err){
        console.log('bad teacher id');
        pr.reject(err);
    });

    return pr.promise;
    
}

function userStatistics(id){
    var pr = q.defer();
    user.findOne({_id: id},{'_id':0,'firstName': 1, 'lastName':1, 'email':1, 'number':1, 'role':1, 'status':1},{}).then(function(data){
        if (data){
            var userInfo ={};
                        userInfo.firstName = data.firstName;
                        userInfo.lastName = data.lastName;
                        userInfo.email = data.email;
                        userInfo.number = data.number;
                        userInfo.role = data.role;
                       
           
            if(data.role == 'admin'){
             
                pr.resolve(userInfo);
            }
            else if(data.role == 'user' || data.role == 'guest'){
                    userInfo.status = data.status;
                stackService.findResults({userId:id},{'_id':0,'result':1,'teacherId':1,'date':1,'teacherFirstName': 1,'teacherLastName': 1},{}).then(function(data2){
                        
                    if(data2){
                        userInfo.results = data2;
                        pr.resolve(userInfo);
                    }
                    else pr.resolve(userInfo);
                }).catch(function(err){
                    pr.reject(err);
                });
            }
            else if(data.role == 'teacher'){
                getTeacherStatus(id).then(function(dataT){
                    if(dataT){
                        userInfo.totalTests = dataT.totalTests;
                        userInfo.assignTest = dataT.assignTest;
                        pr.resolve(userInfo);
                     }
                }).catch(function(err){
                    pr.reject(err);
                })
            }
        }
        else {
            pr.resolve('user not found');
        }

    }).catch(function(err){
        pr.reject('Bad data :(');
    });
    return pr.promise;
}
function getTeachers(){
    var prom = q.defer();
        userAs.find({role: 'teacher'},{},{},function(err,data){
            if(err){
            }
            else{
                var dermo = [];
                async.each(data,function(dat,callback) {
                            stackAs.count({teacherId : dat._id},function(err,data1){
                                if(err) {
                                    callback(err,'error');
                                }
                                else{ 
                                    resultsAs.count({teacherId :  dat._id},function(err,data2){
                                        if(err) {
                                            callback(err,'error');
                                        }
                                        else{
                                            var teacher = {
                                                _id : dat._id,
                                                firstName : dat.firstName,
                                                lastName : dat.lastName,
                                                email : dat.email,
                                                number : dat.number,
                                                totalTests : data2,
                                                assignTest : data1
                                            };
                                            dermo.push(teacher);
                                            callback(null,teacher); 
                                        }
                                    })  
                                }
                        });
            
                    }, function (err) {
                        if(err) {
                            prom.reject(err);
                        }
                        else {
                             prom.resolve(dermo);
                            
                            }
                 });
            }

        });
            

    
    return prom.promise;    
}
function assignStudents(students){
    var prom = q.defer();
            var userIds =[];
            var tempArr = [];
            var userArr = [];
            tempArr = students;
            for(var i=0; i<tempArr.length; i++){
                var user = {};
                user._id = tempArr[i].userId;
                userArr.push(user);
                userIds.push(tempArr[i].userId);
            }
            tempArr.forEach(function(element){
                updateStatus(element.userId,'open');
            });
            
            find({$or:userArr},{'firstName': 1, 'lastName':1, 'email':1},{}).then(function(data){
                
                var openArr = [];
                for(var i=0; i<data.length; i++){
                    var open ={};
                    open.firstName = data[i].firstName;
                    open.lastName = data[i].lastName;
                    open.email = data[i].email;
                    open.userId = data[i]._id;
                    open.dateStart = tempArr[i].dateStart;
                    open.dateEnd = tempArr[i].dateEnd;
                    openArr.push(open);
                }
                stackService.addOpenTestsArray(openArr).then(function(data){
                     stackService.removeRequestCollection({userId : {$in : userIds}}).then(function(data){
                        prom.resolve(data);
                     }).catch(function(err){
                        prom.reject(err);
                     })
                            
                 }).catch(function (err) {
                    prom.reject(err);
                });

            }).catch(function(err){
                prom.reject(err);
            });
    return prom.promise;
}

function statisticsFind(body){
    var prom = q.defer();
            var a = body.name;
            var b = a;
            var c = b.replace(/(\.|\\|\+|\*|\?|\[|\^|\]|\$|\(|\)|\{|\}|\=|\!|\<|\>|\||\:|\-)/g, '\\$1');
            if(body.name!="" && body.res != true && body.req != true && body.finish != true){
                find({ fullName: new RegExp(c, "i") }, { '_id': 1, 'firstName': 1, 'lastName': 1, 'email': 1 }, {}).then(function (data) {
                   prom.resolve(data);
                }).catch(function (err) {
                    prom.reject(err);
                });
            } 
            else if(body.name=="" && body.res != true && body.req != true && body.finish != true){
                var arr =[];
                prom.resolve(arr);
            }
            else if(body.res == true){
                stackService.findResults({ $or:[{'firstName': new RegExp(c, "i")},{'lastName': new RegExp(c, "i")},{'email': new RegExp(c, "i")}] }, { '_id': 0, 'firstName': 1, 'lastName': 1, 'email': 1,'userId':1 }, {}).then(function (data) {
                   var arr = [];
                   data.forEach(function(element){
                        arr.push(element.userId);
                   });
                       find({_id: {$in : arr}},{},{}).then(function(data){
                            prom.resolve(data);
                       }).catch(function(err){
                            prom.reject(err);
                       })
                  
                }).catch(function (err) {
                    prom.reject(err);
                });
            }
            else if(body.req == true){
                 stackService.findRequest({ $or:[{'firstName': new RegExp(c, "i")},{'lastName': new RegExp(c, "i")},{'email': new RegExp(c, "i")}] }, { '_id': 0, 'firstName': 1, 'lastName': 1, 'email': 1,'userId':1 }, {}).then(function (data) {
                   var arr = [];
                   data.forEach(function(element){
                        var user ={};
                        user.firstName = element.firstName;
                        user.lastName = element.lastName;
                        user.email = element.email;
                        user._id = element.userId;
                        arr.push(user);
                   });
                   prom.resolve(arr);
                }).catch(function (err) {
                    prom.reject(err);
                });
            }
            else if(body.finish == true){
                
                getFinishedList(true,{ '_id': 1, 'firstName': 1, 'lastName': 1, 'email': 1 },c).then(function (data) {
                   prom.resolve(data);
                }).catch(function (err) {
                    prom.reject(err);
                });
            }
    return prom.promise;
}

module.exports.getAllUsers = getAllUsers;
module.exports.addNewUser = addNewUser;
module.exports.addNewUsers = addNewUsers;
module.exports.authenticate = authenticate;
module.exports.removeCollection = removeCollection;
module.exports.getAllRole = getAllRole;
module.exports.userInfo = userInfo;
module.exports.getUserStatus = getUserStatus;
module.exports.find = find;
module.exports.getFinishedList = getFinishedList;
module.exports.submit1 = submit1;
module.exports.submitDemo = submitDemo;
module.exports.submit2 = submit2;
module.exports.update = update;
module.exports.updateStatus = updateStatus;
module.exports.userStatistics = userStatistics;
module.exports.getTeachers = getTeachers;
module.exports.getTeacherStatus = getTeacherStatus;
module.exports.assignStudents = assignStudents;
module.exports.statisticsFind = statisticsFind;

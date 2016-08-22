var express = require('express');
var contracts = require('../contracts');
var roleSecurity = require('../contracts').roleSecurity;
var service = require('../../services/userService');
var stackService = require('../../services/stackService');
var testService = require('../../services/testService');
var path = require("path");
var router = express.Router();

var passport = require('passport');
var jwt = require('jsonwebtoken');
var key = require('../../config.json');

router.use(passport.initialize());
require('../../passport')(passport);



router.get('/requestTest', passport.authenticate('jwt', { session: false }),  function(req, res){
			roleSecurity(req,res,'user',function(){
				var doc = {
					userId: req.user._id ,
					firstName: req.user.firstName,
					lastName: req.user.lastName,
					email: req.user.email
				}
				stackService.addRequest(doc).then(function(data){
					service.updateStatus(doc.userId, 'req');
					res.send('ok');
				}).catch(function(err){
					res.status(422).send(err);
				});
			});			
});

router.get('/getTest',  passport.authenticate('jwt', { session: false }),function(req, res){
		if(req.user.role == 'user' || req.user.role == 'guest' ){
       		stackService.findOpenTests({userId: req.user._id},{},{}).then(function (data){
			if(data[0] !== undefined){
				testService.getTest(data[0]).then(function(data){
					res.send(data);
					stackService.removeOpenTestsCollection({userId: req.user._id}).then(function(data){
						service.updateStatus(req.user._id, 'stack');
					}).catch(function(err){
						res.status(401).send(err);
					})
				}).catch(function(err){
					res.json(err);
				});
			}else{
				res.status(401).send("unauthorized");
			}
		}).catch(function(err){
			res.json(err);
		});
    	}
    	else{
        	res.status(403).send('Forbidden');
    	}
		
});

//--------------for demonstration (one demonstration test)


router.get('/getTestDemo',  passport.authenticate('jwt', { session: false }),function(req, res){
		if(req.user.role == 'user' || req.user.role == 'guest' ){
       		stackService.findOpenTests({userId: req.user._id},{},{}).then(function (data){
			if(data[0] !== undefined){
				testService.getTestDemo().then(function(data){

					var user = {};

					user.userId = req.user._id;
					user.firstName = req.user.firstName;
					user.lastName = req.user.lastName;
					user.email = req.user.email;
					user.answersAuto = [];

					data.forEach(function(element) {
						var tarr = [];
						tarr.push(element.answers[0]);
                        user.answersAuto.push({_qId:element.id, answer: tarr});						
                    });
					// res.send(data);



					stackService.addStacks(user).then(function(){
                        stackService.removeOpenTestsCollection({userId: req.user._id}).then(function(){
							// потом переделать чере промисы
							service.updateStatus(req.user._id, 'stack');
							res.send(data);
						}).catch(function(err){
							res.status(401).send(err);
						});
                    }).catch(function(err){
                        defer.reject(err);
                    });

				}).catch(function(err){
					res.status(401).send(err);
				});
			}else{
				res.status(401).send("unauthorized");
			}
		}).catch(function(err){
			res.json(err);
		});
    	}
    	else{
        	res.status(403).send('Forbidden');
    	}
		
});

router.post('/submitDemo', contracts.submit1, passport.authenticate('jwt', { session: false }), function(req,res){
	service.submitDemo(req.body, req.user._id).then(function(data){
		res.json(data);
	}).catch(function(err){
		res.status(400).send(err);
	});
});


//----------------------------

router.post('/submit1', contracts.submit1, passport.authenticate('jwt', { session: false }), function(req,res){
	service.submit1(req.body, req.user._id).then(function(data){
		res.json(data);
	}).catch(function(err){
		res.status(400).send(err);
	});
});

router.post('/submit2', contracts.submit2, passport.authenticate('jwt', { session: false }), function(req,res){
	service.submit2(req.body, req.user._id).then(function(data){
		res.send();
	}).catch(function(err){
		res.status(400).send(err);
	});
});

module.exports = router;
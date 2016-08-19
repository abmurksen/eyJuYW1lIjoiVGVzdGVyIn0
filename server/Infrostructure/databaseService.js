var q = require('q');
var jwt = require('jsonwebtoken');
var key = require('../config.json');

var Promiseeee = q.Promise;

var DatabasService = function (model){
    this.model = model;
}
// DatabasService.prototype.find = function(query, fields, options){
//     var defer = q.defer();
//     this.model.find(query, fields, options,function(err ,data){
//         if(err) defer.reject(err);
//         defer.resolve(data);

//     });
//     return defer.promise;
// }

DatabasService.prototype.find = function(query, fields, options){

    var self = this;

    var p = new Promiseeee(function(resolve, reject) {
        self.model.find(query, fields, options, function(err ,data){
            if(err) {
                reject(err);   
            }
            resolve(data);
        });    
    });
    
    return p;
}


DatabasService.prototype.findById = function(id, fields, options){
    var defer = q.defer();
    this.model.findById(id, fields, options,function(err ,data){
        if(err) defer.reject(err);
        defer.resolve(data);

    });

    return defer.promise;
}
DatabasService.prototype.remove = function(query){
    var defer = q.defer();
    this.model.remove(query,function(err){
        if(err) defer.reject(err);
        defer.resolve("removed");

    });

   return defer.promise;
}
DatabasService.prototype.save = function(query){
    var defer = q.defer();
    var doc = new  this.model(query);
    doc.save(function(err,data){
        if(err) defer.reject(err);
        defer.resolve(data);
    });

    return defer.promise;
}

DatabasService.prototype.create = function(query){
    var defer = q.defer();
    this.model.create(query,function(err,data){
        if(err) defer.reject(err);
        defer.resolve(data);
    });

    return defer.promise;
}
DatabasService.prototype.findOne = function(query, fields, options){
    var defer = q.defer();
    this.model.findOne(query, fields, options,function(err ,data){
        if(err) defer.reject(err);
        defer.resolve(data);

    });

    return defer.promise;
}

DatabasService.prototype.count = function (query) {
    var defer = q.defer();
    this.model.count(query, function(err ,data){
        if(err) defer.reject(err);
        defer.resolve(data);
    });
    return defer.promise;
}

DatabasService.prototype.update = function (query, update,options) {
    var defer = q.defer();
    this.model.update(query,update,options, function(err ,data){
        if(err) defer.reject(err);
        defer.resolve();
    });
    return defer.promise;
}


module.exports = function(model){
    return new DatabasService(model);
};
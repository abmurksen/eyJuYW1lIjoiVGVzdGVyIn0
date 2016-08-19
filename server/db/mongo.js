
var mongoose = require('mongoose');
var infrostructure = require('../Infrostructure/databaseService');
var path = require('../config.json')

var user = require('./schemes/user');
var testA = require('./schemes/testA');
var testB = require('./schemes/testB');
var stack = require('./schemes/stack');
var results = require('./schemes/results');
var request = require('./schemes/request');
var openTests = require('./schemes/openTests');

mongoose.connect(path.dbPath);
exports.userAs = user;
exports.stackAs = stack;
exports.resultsAs = results;
exports.user = infrostructure(user);
exports.testA  = infrostructure(testA);
exports.testB = infrostructure(testB);
exports.stack = infrostructure(stack);
exports.results = infrostructure(results);
exports.request = infrostructure(request);
exports.openTests = infrostructure(openTests);

	
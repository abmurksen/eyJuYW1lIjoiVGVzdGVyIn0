
var mongoose = require('mongoose');
var infrostructure = require('../Infrostructure/databaseService');
var path = require('../config.json')

var tests = require('./schemes/tests');
var user = require('./schemes/user');
var openTestsA = require('./schemes/openTests');
var testA = require('./schemes/testA');
var testDemo = require('./schemes/testDemo');
var testB = require('./schemes/testB');
var stack = require('./schemes/stack');
var results = require('./schemes/results');
var request = require('./schemes/request');
var openTests = require('./schemes/openTests');

mongoose.connect(path.dbPath);
exports.userAs = user;
exports.openTestsAs =  openTestsA;
exports.stackAs = stack;
exports.resultsAs = results;
exports.user = infrostructure(user);
exports.testA  = infrostructure(testA);
exports.testDemo  = infrostructure(testDemo);
exports.testB = infrostructure(testB);
exports.stack = infrostructure(stack);
exports.results = infrostructure(results);
exports.request = infrostructure(request);
exports.openTests = infrostructure(openTests);
exports.tests = infrostructure(tests);

	
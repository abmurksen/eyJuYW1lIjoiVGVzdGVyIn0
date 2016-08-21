var mongo = require('../../db/mongo');
var testService = require('../../services/testService');
var testD = require('./questions.json');


function addAll(test) {
    testService.addQuestionArrayDemo(test).then(function (data) {
        console.log('questions added ');
    }).catch(function (err) {
        console.log(err);
    });

}

console.log('Default testGen. Please, wait...');
testService.removeCollectionDemo({}).then(function (data) {  
    addAll(testD);
}).catch(function (err) {
	console.log(err);
});






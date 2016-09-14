var express = require('express');
var contracts = require('../contracts');
var service = require('../../services/userService');
var stackService = require('../../services/stackService');
var testService = require('../../services/testService');
var path = require("path");
var router = express.Router();
var roleSecurity = require('../contracts').roleSecurity;
var async = require('async');


var userAs = require('../../db/mongo').userAs;
var openTestsAs = require('../../db/mongo').openTestsAs;


var passport = require('passport');
var jwt = require('jsonwebtoken');
var key = require('../../config.json');

router.use(passport.initialize());
require('../../passport')(passport);

router.post('/register', contracts.adminRegister, passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		var info = {
			email: req.body.email,
			password: req.body.password,
			firstName: req.body.firstName,
			lastName: req.body.secondName,
			role: 'guest',
			status: 'open',
			fullName: req.body.firstName + ' ' + req.body.secondName + ' ' + req.body.email
		};
		var guestOpen = {

			firstName: req.body.firstName,
			lastName: req.body.secondName,
			email: req.body.email,
			dateStart: req.body.dateStart,
			dateEnd: req.body.dateEnd
		};
		service.addNewUser(info).then(function (data) {
			res.json(data);

			guestOpen.userId = data._id;
			stackService.addOpenTests(guestOpen).then(function (data) {

			}).catch(function (err) {
				//console.log("guest is not in openTests");
			});
		}).catch(function (err) {
			res.status(400).send(err);
		});
	});


});

router.post('/newUser', contracts.adminRegister, passport.authenticate('jwt', { session: false }), function (req, res) {

	service.addNewUser(req.body).then(function (data) {
		res.json(data);

	}).catch(function (err) {
		res.status(400).send(err);
	});
});


router.post('/assignStudents', contracts.assignStudent, passport.authenticate('jwt', { session: false }), function (req, res) {
	 		roleSecurity(req, res, 'admin', function () {
		var stud = req.body.students;
		service.assignStudents(stud).then(function (data) {
			res.send('add');
		}).catch(function (err) {
			res.status(401).send(err);
		});
	 		});


});

router.post('/addQuestion', contracts.addQuestion, passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		if (!req.body.finalQue.options) {

			testService.addNewQuestionB(req.body.finalQue).then(function (data) {
				res.send('ok');
			}).catch(function (err) {
				res.status(406).send("Not Acceptable");
			});
		}
		else {

			testService.addNewQuestion(req.body.finalQue).then(function (data) {
				res.send('ok');
			}).catch(function (err) {
				res.status(406).send("Not Acceptable");
			});
		}
	});

});

router.post('/assignTeacher', contracts.assignTeacher, passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		stackService.assignTeacher(req.body).then(function (data) {
			res.send('ok');
		}).catch(function (err) {
			res.status(400).send(err);
		});
	});

});

router.get('/getTeachers', passport.authenticate('jwt', { session: false }), function (req, res) {
  		roleSecurity(req, res, 'admin', function () {
		service.getTeachers().then(function (data) {
			res.send(JSON.stringify(data));
		}).catch(function (err) {
			res.status(400).send(err);
		});
  		});

});

router.get('/getFinishedUsers', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		service.getFinishedList(false, { 'pasword': 0 }).then(function (data) {
			res.json(data);
		}).catch(function (err) {
			res.status(400).send(err);
		})
	});

});
router.get('/getFinishedUsersNames', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		service.getFinishedList(false, { '_id': 0, 'firstName': 1, 'lastName': 1 }).then(function (data) {
			res.json(data);
		}).catch(function (err) {

			res.status(400).send(err);
		})
  		});

});

router.get('/getUsersRequests', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		service.find({ status: 'req', $or: [{ 'role': 'guest' }, { 'role': 'user' }] }, { '_id': 1, 'firstName': 1, 'lastName': 1, 'email': 1, 'number': 1, 'role': 1 }, {}).then(function (data) {
			res.send(JSON.stringify(data));
		}).catch(function (err) {
			res.status(400).send(err);
		});
  		});


});
router.get('/getUsersRequestsNames', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		service.find({ status: 'req', $or: [{ 'role': 'guest' }, { 'role': 'user' }] }, { '_id': 0, 'firstName': 1, 'lastName': 1 }, {}).then(function (data) {
			res.send(JSON.stringify(data));
		}).catch(function (err) {
			res.status(400).send(err);
		});
  		});

});

router.get('/getFreeUsers', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		service.find({ status: 'free', $or: [{ 'role': 'guest' }, { 'role': 'user' }] }, { '_id': 1, 'firstName': 1, 'lastName': 1, 'email': 1, 'number': 1, 'role': 1 }, {}).then(function (data) {
			res.send(JSON.stringify(data));
		}).catch(function (err) {
			res.status(400).send(err);
		});
  		});

});
router.get('/getResults', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		stackService.findResults({}, {}, {}).then(function (data) {
			res.send(JSON.stringify(data));
		}).catch(function (err) {
			res.status(400).send(err);
		});
	});

});
router.get('/getResultsNames', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		stackService.findResults({}, { '_id': 0, 'firstName': 1, 'lastName': 1 }, {}).then(function (data) {
			res.send(JSON.stringify(data));
		}).catch(function (err) {
			res.status(400).send(err);
		});
	});

})
router.post('/getFromReg', contracts.getFromReg, passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		service.statisticsFind(req.body).then(function (data) {
			res.send(data);
		}).catch(function (err) {
			res.status(400).send(err);
		})
	});


});
router.post('/showStatistics', contracts.showStstistics, passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		service.userStatistics(req.body.id).then(function (data) {
			res.send(data);
		}).catch(function (err) {
			res.status(400).send(err);
		});
	});

});

router.get('/getComplainted', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		testService.getComplaintedA().then(function (data) {
			testService.getComplaintedB().then(function (data1) {
				res.send(data.concat(data1));
			})
		});
	});

});

router.post('/blockComplained', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		testService.blockComlained(req.body.A, req.body.B).then(function (data) {
			res.send('ok');
		}).catch(function (err) {
			res.status(400).send(err);
		})
	});

});

router.post('/disblockComplained', function (req, res) {
	testService.disblockComlained(req.body.A, req.body.B).then(function (data) {
		res.send('ok');
	}).catch(function (err) {
		res.status(400).send(err);
	});
});

//------------------------------

router.post('/assignNewTest', function (req, res) {
	var users = req.body.users;
	var tests = req.body.tests;
    async.each(users, function (data, callback) {
		var obj = {};
		obj.tests = tests;
		obj.userId = data.id;
		obj.firstName = data.firstName;
		obj.lastName = data.lastName;
		obj.email = data.email;
		obj.dateStart = req.body.date.start;
		obj.dataEnd = req.body.date.end;
		openTestsAs.create(obj, function (err, data) {
			if (err) callback(err, 'error');
			else {
				// callback(null,'succes');
			}
		}, function (err) {
			if (err) {
				res.status(401).send(err);
			}
			else {
				res.send('ok');

			}
		});
	});


});

router.post('/getTestsList', function (req, res) {
	if (req.body.name == '') {
		testService.getTestsList({}, {}, {}).then(function (data) {
			res.send(data);
		}).catch(function (err) {
			res.status(401).send(err);
		});
	} else {
		var c = req.body.replace(/(\.|\\|\+|\*|\?|\[|\^|\]|\$|\(|\)|\{|\}|\=|\!|\<|\>|\||\:|\-)/g, '\\$1');

		testService.getTestsList({ 'name': new RegExp(c, "i") }, {}, {}).then(function (data) {
			res.send(data);
		}).catch(function (err) {
			res.status(401).send(err);
		});
	}
});


router.get('/getReportDemo', function (req, res) {
	stackService.findResults({}, { 'userId': 0, '_id': 0, 'teacherId': 0 }, {}).then(function (data) {
		res.send(data);
	}).catch(function (err) {
		res.status(400).send(err);
	});
});

router.get('/getComplaintedDemo', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		testService.getComplaintedDemo().then(function (data) {
			res.send(data);
		});
	});

});

router.post('/blockComplainedDemo', passport.authenticate('jwt', { session: false }), function (req, res) {
	roleSecurity(req, res, 'admin', function () {
		testService.blockComlainedDemo(req.body.A).then(function (data) {
			res.send('ok');
		}).catch(function (err) {
			res.status(400).send(err);
		})
	});

});

router.get('/getAll', function (req, res) {
	service.getAllUsers().then(function (data) {
		res.send(data);
	}).catch(function (err) {
		res.status(401).send(err);
	})
})


router.post('/disblockComplainedDemo', function (req, res) {
	testService.disblockComlainedDemo(req.body.A).then(function (data) {
		res.send('ok');
	}).catch(function (err) {
		res.status(400).send(err);
	});
});
//------------------------------

module.exports = router;

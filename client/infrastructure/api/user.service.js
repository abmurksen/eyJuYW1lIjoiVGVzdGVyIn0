(function () {
    'use strict';

    angular.module('infrastructure')
        .service('userService', ['httpService', 'context',  'authService',
            function(httpService, context, authService) {
                var host = location.origin;

                return {
                    login: function (login, password) {
                        return httpService.post(host + '/login', {email: login, password: password})
                            .then(
                                function(result) {
                                    localStorage.setItem('context', JSON.stringify(result.data));
                                    authService.init();
                                    return true;
                                },
                                function () {
                                    console.log('Wrong credentials!');
                                    return false;
                                }
                            );
                    },
                    getUsers: function () {
                        return httpService.get(host + '/admin/getUsers')
                            .then(
                                function (result) {
                                    return result.data;
                                }
                            )
                    },

                    getTeachers: function () {
                        return httpService.get(host + '/admin/getTeachers')
                            .then(
                                function (result) {
                                    return result.data;
                                }
                            )
                    },

                    getAll: function () {
                        return httpService.get(host + '/admin/getAll')
                            .then(
                                function (result) {
                                    return result.data;
                                }
                            )
                    },
                    getFreeUsers: function () {
                        return httpService.get(host + '/admin/getFreeUsers')
                            .then(
                                function (result) {
                                    return result.data;
                                }
                            )
                    },
                    getFinishedUsers: function () {
                        return httpService.get(host + '/admin/getFinishedUsers')
                            .then(
                                function (result) {
                                    return result.data;
                                }
                            )
                    },
                    getResults: function () {
                        return httpService.get(host + '/admin/getResults')
                            .then(
                                function (result) {
                                    return result.data;
                                }
                            )
                    },
                    getUsersRequests: function () {
                        return httpService.get(host + '/admin/getUsersRequests')
                            .then(
                                function (result) {
                                    return result.data;
                                }
                            )
                    },
                    getTests: function () {
                        return httpService.get(host + '/teacher/getTests')
                            .then(
                                function (result) {
                                    return result.data;
                                }
                            )
                    },


                    newUser: function (firstName_, secondName_, email_, number_, _dateStart,_dateEnd) {
                        return httpService.post(host + '/admin/register', {password: 11111, email: email_,
                                firstName: firstName_, secondName: secondName_, phone: number_, dateStart: _dateStart, dateEnd: _dateEnd})
                            .then(function(result){
                                    console.log('new user created');
                                    return true;
                                },
                                function () {
                                    console.log('create new user failed');
                                    return false;
                                }
                            );
                    },

                    getTest: function () {
                        return httpService.get(host + '/user/getTest')
                            .then(
                                function(result) {
                                    return result.data;
                                }
                            )
                    },
                    checkTest: function(data) {
                        return httpService.post(host+'/teacher/checkTest', data);
                    },
                    assignStudents: function(list) {
                        console.log(list);
                        return httpService.post(host + '/admin/assignStudents', {students: list});
                    },

                    assignTeacher: function(user, tch) {
                        return httpService.post(host + '/admin/assignTeacher', {userId: user, teacherId: tch});
                    },

                    halfSmoke: function(data) {
                        return httpService.post(host + '/admin/addQuestion', {finalQue : data});
                    },
                    sendTestRequest: function() {
                        return httpService.get(host +'/user/requestTest')
                            .then ( function() {

                        })
                    },
                    sendFirstPart: function(data) {
                        return httpService.post(host+'/user/submit1', data)
                            .then ( function(result) {
                                return result.data;
                            })
                    },
                    sendSecondPart: function(data) {
                        return httpService.post(host+'/user/submit2', data)
                            .then ( function(result) {
                                return result.data;
                            })
                    },
                    getStatus: function() {
                        return httpService.get(host+'/status')
                            .then (function(result) {
                                return result.data;
                            })
                    },

                    searchUser: function(data) {
                        return httpService.post(host + '/admin/getFromReg', data)
                            .then (function(result) {
                                return result.data;
                        })
                    },

                    showInfoProfile: function(data) {
                        return httpService.post(host + '/admin/showStatistics', {id: data})
                            .then (function(result) {
                                return result.data;
                            })
                    },

                    getTestsList : function() {
                        return httpService.get(host + '/teacher/getTests')
                            .then (function(result) {
                                return result.data;
                            })
                    },

                    getOneTest: function(data) {
                        return httpService.post(host + '/teacher/checkTest', data)
                            .then (function(result) {
                                return result.data;
                            })

                    },

                    editProfile: function(data) {
                        return httpService.post(host + '/editNumber', {number: data});
                    },

                    finishCheck: function(data) {
                        return httpService.post(host + '/teacher/submit3', data);
                    },

                    newsTypeOne: function() {
                        return httpService.get(host + '/admin/getUsersRequestsNames');
                    },

                    newsTypeTwo: function() {
                        return httpService.get(host + '/admin/getFinishedUsersNames');
                    },

                    newsTypeThree: function() {
                        return httpService.get(host + '/admin/getResultsNames');
                    },

                    getProfileStatistics: function() {
                        return httpService.get(host + '/profile')
                            .then(function(result) {
                                return result.data;
                            })
                    },
                    getBadQuestions: function() {
                        return httpService.get(host + '/admin/getComplainted')
                            .then (function(result) {
                                return result.data;
                            })
                    },
                    sendBadQuestions: function(data) {
                        return httpService.post(host + '/admin/blockComplained', data);
                    },
                    sendGoodQuestions: function(data) {
                        return httpService.post(host + '/admin/disblockComplained', data);
                    }



                };
            }]);
})();
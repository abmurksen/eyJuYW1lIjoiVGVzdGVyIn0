(function () {
    'use strict';
    angular.module('myApp')
        .factory('navigationFactory', ['context',
        function (context) {

            var adminNav = [
                {
                    name: 'Пользователи',
                    state: 'usersState'
                },
                {
                    name: 'Тесты',
                    tabs: [
                        {
                             name: 'Добавить тест',
                             state: 'createNewTest'
                        },
                        {
                            name: 'Назначение теста студентам',
                            state: 'assignStd'
                        }
                    ]
                    // state: 'tests'
                },
                {
                    // name: 'Отчёты',
                    // // state: 'reports'
                },
                {
                    name: 'Администрирование',
                    // state: 'administration',
                    tabs: [                   
                        {
                                name: 'Создать пользователя',
                                state: 'newUser'
                        }
                        // {
                        //     name: 'Профили',
                        //     // state: 'newUser'
                        // }
                        // {
                        //     name: 'Назначение теста студентам',
                        //     state: 'assignStd'
                        // }
                    ]
                }
                // {
                //     name: 'Home',
                //     state: 'home'
                // }
                // {
                //     name: 'Администрирование',
                //     tabs: [
                //         {
                //             name: 'Назначение теста студентам',
                //             state: 'assignStd'
                //         },
                //         {
                //             name: 'Создать пользователя',
                //             state: 'newUser'
                //         },
                //         {
                //             name: 'Отчёты',
                //             state: 'reports'
                //         }
                //     ]
                // },
                // {
                //     name: 'Статистика',
                //     state: 'statistics'
                // },
                // {
                //     name: 'Тесты',
                //     tabs: [
                //         {
                //             name: 'Добавить вопрос',
                //             state: 'addQuestion'
                //         },
                //         {
                //             name: 'Плохие вопросы',
                //             state: 'badQuestions'
                //         }
                //     ]
                // }


            ];

            var userNav = [
                {
                    name: 'Home',
                    state: 'home'
                }
            ];

            var teacherNav = [
                {
                    name: 'Home',
                    state: 'home'
                }
            ];

            var guestNav = [
                {
                    name: 'Home',
                    state: 'home'
                }
            ];

            return {
              getNavigationMenu: function () {
                  var role = context.getRole();
                  switch (role) {
                      case 'admin':
                          return adminNav;
                      case 'user':
                          return userNav;
                      case 'teacher':
                          return teacherNav;
                      case 'guest':
                          return guestNav;
                  }
              }
            };
        }])
})();
(function () {
    'use strict';

    angular.module('infrastructure')
        .factory('context', [
            function() {
                var user = {
                    id: "",
                    firstName: "",
                    lastName: "",
                    role: "",
                    email: ""
                };

                return {
                    init: function (userData) {
                        if (userData) {
                            user.id = userData._id;
                            user.firstName = userData.firstName;
                            user.lastName = userData.lastName;
                            user.role = userData.role;
                            user.email = userData.email;
                            
                        }
                    },
                    clear: function () {
                        user.id = "";
                        user.firstName = "";
                        user.lastName = "";
                        user.role = "";
                        user.email = "";
                        
                    },
                    getRole: function () {
                        return user.role;
                    },
                    isAdmin: function () {
                        return user.role === 'admin';
                    },
                    isUser: function () {
                        return user.role === 'user';
                    },
                    isTeacher: function () {
                        return user.role === 'teacher';
                    },
                    isGuest: function () {
                        return user.role === 'guest';
                    },
                    getFirstName: function() {
                        return user.firstName;
                    },
                    getLastName: function() {
                        return user.lastName;
                    },
                    getEmail: function() {
                        return user.email;
                    },
                    getId: function() {
                        return user.id;
                    }
                };
            }]);
})();
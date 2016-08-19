(function () {
    'use strict';

    angular.module('infrastructure')
        .factory('httpService', ['$http',
            function($http) {
                return {
                    get: function (url) {
                        var context = JSON.parse(localStorage.getItem('context'));
                        if (!context) {
                            return $http.get(url);
                        }
                        return $http.get(url, {headers: {'Authorization': context.token}});
                    },
                    post: function (url, obj) {
                        var context = JSON.parse(localStorage.getItem('context'));
                        if (!context) {
                            return $http.post(url, obj);
                        }
                        return $http.post(url, obj, {headers: {'Authorization': context.token}});
                    },
                    put: function (url, obj) {
                        var context = JSON.parse(localStorage.getItem('context'));
                        if (!context) {
                            return $http.put(url, obj);
                        }
                        return $http.put(url, obj, {headers: {'Authorization': context.token}});
                    },
                    delete: function () {
                        var context = JSON.parse(localStorage.getItem('context'));
                        if (!context) {
                            return $http.delete(url);
                        }
                        return $http.post(url, {headers: {'Authorization': context.token}});
                    }
                };
            }]);
})();
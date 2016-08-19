(function () {
    'use strict';

    angular.module('infrastructure')
        .factory('notification', ['toaster',
        function (toaster) {
            return {
                success: function (msg) {
                    toaster.pop('success', 'Success', msg);
                },
                error: function (msg) {
                    toaster.pop('error', 'Error', msg);
                },
                warning: function (msg) {
                    toaster.pop('warning', 'Warning', msg);
                },
                info: function (msg) {
                    toaster.pop('note', 'Info', msg);
                }
            }
        }]);
})();
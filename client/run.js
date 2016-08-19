(function () {
    angular.module('myApp')


        .run(['authService', '$location', '$rootScope', 'context', '$state',
            function (authService, $location, $rootScope, context, $state) {
                authService.init();
                if (!authService.isAuthenticated) {
                    $location.path('/login');
                }

                $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams) {
                    if(authService.isAuthenticated) {
                        var role = context.getRole();
                        if (toState.noAuth || toState.role.indexOf(role) === -1) {
                            event.preventDefault();
                            $state.go('home');
                        }
                    } else {
                        if (!toState.noAuth) {
                            event.preventDefault();
                            $state.go('login');
                        }
                    }
                })                

            }]);
})();

(function () {
    'use strict';

    angular.module('infrastructure')
        .factory('EventWrapper', ['eventEmitter',
        function (eventEmitter) {
            function EventWrapper(obj) {
                this.value = obj;
            }

            // Add event emitter methods to EventWrapper.
            eventEmitter.inject(EventWrapper);

            return EventWrapper;
        }]);
})();
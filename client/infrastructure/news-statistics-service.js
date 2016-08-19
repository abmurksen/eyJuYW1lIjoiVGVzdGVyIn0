(function() {
    angular.module('myApp')
        .service('getStatisticsFromNews', [function(){
            var modelStatistic;
            return {
                setPersonStatistic: function(item) {
                    modelStatistic = item;
                },

                getPersonStatistic: function() {
                    return modelStatistic;
                }

            }
        }])
})();
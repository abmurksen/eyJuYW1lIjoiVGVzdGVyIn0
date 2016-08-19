angular.module('home').service('adminHomeService', ['userService', function(userService){


    this.newsList = [
        {
            reqList: userService.newsTypeOne,
            goTo: 'assignStd',
            typeFlag: 'req',
            imageLink: 'assets/images/icons/request.png',
            buttonText: 'Assign',
            messageText: 'Запросили тест.',
        },
        {
            reqList: userService.newsTypeTwo,
            goTo: 'assignTch',
            typeFlag: ' finish',
            imageLink: 'assets/images/icons/forCheck.png',
            buttonText: 'Assign',
            messageText: 'Ждут проверки учителем.'
        },
        {
            reqList: userService.newsTypeThree,
            goTo: 'statistics',
            typeFlag: 'res',
            imageLink: 'assets/images/icons/checkAll.png',
            buttonText: 'Statistics',
            messageText: 'Закончили прохождение теста.'
        }
    ]
}]);
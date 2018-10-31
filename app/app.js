var app = angular.module('sandy', [
    'ngResource',
    'ui.router'
]);
app.config(['$resourceProvider', '$stateProvider', '$urlRouterProvider', function ($resourceProvider, $stateProvider, $urlRouterProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'website/home.html'
        })
        .state('subjects', {
            url: '/subjects',
            templateUrl: 'website/subjects.html'
        })
}]);
app.controller('first', ['$scope', 'firstService', 'firstFactoryMethod', '$state','cacheFactoryUsage', function ($scope, firstService, firstFactoryMethod, $state, cacheFactoryUsage) {
    $scope.name = "async call resquest example";
    $scope.subjects = [];
    $scope.jobs = [];
    firstService.getRequest().then(function (data) {
        $scope.subjects = data;
    });

    firstFactoryMethod.show().$promise.then(function (res) {
        $scope.jobs = res;
    });


    $scope.save = function(){
        cacheFactoryUsage.saveInfo($scope.cacheKey,$scope.cacheValue);
    }

    $scope.get = function(){
        $scope.cache = cacheFactoryUsage.getInfo(1);
    }

    $scope.changeRoute = function () {
        //$state.go('subjects');
    }
}]).factory('firstService', ['$q', '$http', function ($q, $http) {
    var get = function () {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: 'https://api.talentscreen.io/v1/subjects',
            headers: {
                'content-type': 'application/json'
            }
        }).then(function (result) {
            d.resolve(result.data);
        })
        return d.promise;
    }

    return {
        getRequest: get
    }
}]).factory('firstFactoryMethod', ['$resource', function ($resource) {
    return $resource('https://api.qa.talentscreen.io/v1/jobs?authentication=false&limit=10', {}, {
        show: { method: 'GET', headers: { 'content-type': 'application/json' }, isArray: true }
    });
}]).directive('firstDirective', function () {
    return {
        restrict: 'E',
        scope: {
            source: "=",
            field: '@'
        },
        templateUrl: 'directives/directive.html'
    }
}).factory('cacheFactoryUsage', ['$cacheFactory', function ($cacheFactory) {
    var cacheVariable = $cacheFactory('sandy');

    var saveInfo = function (key,data) {
        cacheVariable.put(key, data);
    }


    var getInfo = function (key) {
        return cacheVariable.get(key);
    }


    return {
        saveInfo: saveInfo,
        getInfo: getInfo
    }


}])
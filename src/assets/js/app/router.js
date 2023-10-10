'use strict';

angular.module('router',['ngRoute'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/channels'});
    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/:name*',{
                templateUrl:function(urlattr){
                    return 'views/' + urlattr.name + '.html'
                }
            });
    }])

'use strict';


angular.module('app', [
    'ngRoute',
    'router',
    'ngWebSocket'
]).run(function($rootScope,$location,$hcontrol){
    //Root Scope Items Go Here:
    $rootScope.$on('page.event',function(event,args){
        console.log('Got Page Event, Switching Page to:',args);
        $location.path(args);
    })

    //Initiate Connection:
    console.log('Starting Connection Attempt');
    $hcontrol.controller.set.internal(true);

    $rootScope.$on('hcontrol.connection',function(event,args){
        if (args.message === "Hosted Connection Error"){
            console.log('Internal Connection Error');
            console.log("Starting External Connection");
            $hcontrol.controller.get.externalCredentials('assets/configuration/controller.json',true);
        }
    });




})
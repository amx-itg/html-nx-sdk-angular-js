angular.module('app').directive('amxNxConnectionConfig',function(){
    return {
        restrict:'E',
        scope:{
            config:'=configuration'
        },
        controller: connectConfig,
        templateUrl:'./components/html/amx-nx-connection-config.component.html'
    }
});

connectConfig = function ($rootScope,$scope,$http,$hcontrol){
    //Look for an external configuration file:
    $scope.controller = {
        url:"",
        key:"",
        username:"",
        password:""
    }
    $http.get('assets/configuration/controller.json')
        .then(function success(response){
             $scope.controller.url = response.data.url;
             $scope.controller.key = response.data.key;
             $scope.controller.username = response.data.username;
             $scope.controller.password = response.data.password;

             //Auto-Connects if Controller.json file is found. Debug only?
             //$scope.connect();
        },function error(response){
            console.log("Error, Configuration File doesn't exist");
        })

    $scope.connect = function(){
        $hcontrol.controller.set.external($scope.controller.url, $scope.controller.key,$scope.controller.username,$scope.controller.password);
        $hcontrol.controller.init();
    }
    $scope.disconnect = function(){
        $hcontrol.controller.close();
    }

    $scope.$on('hcontrol.connection',function(evt,args){
        //console.log('connection event',args);
        if (args.type === 'connection'){
            switch(args.message){
                case('connected'):{$('#connectStatus').removeClass('bg-danger').removeClass('bg-warning').addClass('bg-success');break}
                case('disconnected'):{$('#connectStatus').removeClass('bg-success').removeClass('bg-warning').addClass('bg-danger');break}
                case('error'):{$('#connectStatus').removeClass('bg-success').removeClass('bg-danger').addClass('bg-warning');break}
            }
        }

    })

    connect = $scope;
    connect.hc = $hcontrol;
}
connectConfig.$inject =['$rootScope','$scope','$hcontrol'];
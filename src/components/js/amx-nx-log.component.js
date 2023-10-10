angular.module('app').directive('amxNxLog',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: logFn,
        templateUrl:'./components/html/amx-nx-log.component.html'
    }
});

logFn = function($rootScope,$scope,$hcontrol){
    $scope.messages = [];

    $scope.log = ($scope.configuration !== undefined) ? $scope.configuration : {};
    if ($scope.log.inIcon == undefined) {$scope.log.inIcon = 'bi bi-arrow-right'}
    if ($scope.log.outIcon == undefined) {$scope.log.outIcon = 'bi bi-arrow-left'}
    if ($scope.log.connectIcon == undefined) {$scope.log.connectIcon = 'bi bi-activity'}
    if ($scope.log.maxItems == undefined) {$scope.log.maxItems = 50}

    $scope.getTime = function(){
        return  new Date().toLocaleTimeString().split(' ')[0];
    }
    $scope.$on('hcontrol.connection',function (evt,data){
        if (data.type === 'connection'){
            let i = {};
            switch(data.message){
                case('connected'):{
                    i = {
                        icon: $scope.log.connectIcon + " text-success",
                        time: $scope.getTime(),
                        path: "connection",
                        value: true
                    };
                    break;
                }
                case('disconnected'):{
                    i = {
                        icon: $scope.log.connectIcon,
                        time: $scope.getTime(),
                        path: "connection",
                        value: false
                    };
                    break;
                }
                case('error'):{
                    i = {
                        icon: $scope.log.connectIcon + " text-warning",
                        time: $scope.getTime(),
                        path: "connection",
                        value: "error"
                    };
                    break;
                }
                case('closed'):{
                    i = {
                        icon: $scope.log.connectIcon + " text-warning",
                        time: $scope.getTime(),
                        path: "connection",
                        value: "closed"
                    };
                    break;
                }
            }
            $scope.addItem(i);
        }
    })

    $scope.$on('hcontrol.log',function(evt,data){
        switch(data.direction){
            case('in'):{
                if (data.msgType !== "@disco"){
                    let i = {
                        icon:$scope.log.inIcon,
                        msgType:data.msgType,
                        time:$scope.getTime(),
                        path: data.data.path,
                        value:data.data.value
                    }
                    $scope.addItem(i);
                }
                break;
            }
            case('out'):{
                let i = {
                    icon:$scope.log.outIcon,
                    msgType:data.msgType,
                    time:$scope.getTime(),
                    path: data.data.path,
                    value:data.data.value
                }
                $scope.addItem(i);
            }



        }
    })

    $scope.addItem = function(data){
        $scope.messages.unshift(data);
        if ($scope.messages.length > $scope.log.maxItems){
            $scope.messages.pop();
        }
        $scope.codeApply();
    }

    $scope.clearLog = function(){
        $scope.messages = [];
        $scope.codeApply();
    }


    $scope._ca = "";
    $scope.codeApply = function(){
        clearTimeout($scope._ca);
        $scope._ca = setTimeout(()=>{
            $scope.$apply();
        },150)
    }
    mylog = $scope;

}
logFn.$inject =['$rootScope','$scope','$hcontrol'];
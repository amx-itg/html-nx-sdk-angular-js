
angular.module('app').directive('amxNxButton',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: btnFn,
        templateUrl:'./components/html/amx-nx-button.component.html'
    }
});
btnFn = function($rootScope,$scope,$hcontrol){
    $scope.btn = ($scope.configuration !== undefined) ? $scope.configuration : {};
    $scope.btn.initText = ($scope.configuration.text !== undefined) ? $scope.configuration.text : "Button";
    $scope.btn.style = ($scope.configuration.style !== undefined) ? $scope.configuration.style : "btn-primary";
    /***** H-CONTROL *********/

    $scope.get = {};
    $scope.set = {};

    $scope.get.button = function(){
        $hcontrol.get.button($scope.btn.port,$scope.btn.channel,'show');
        $hcontrol.get.button($scope.btn.port,$scope.btn.channel,'enable');
        $hcontrol.get.button($scope.btn.port,$scope.btn.channel,'text');
        $hcontrol.get.button($scope.btn.port,$scope.btn.channel);
    }

    $scope.set.btnFn = function(){
        setTimeout(()=>{
            //console.log($scope.btn.port,$scope.btn.channel);
            $('#btn_' + $scope.btn.port + "_" + $scope.btn.channel)
                .unbind()
                .bind('touchstart mousedown', function () {
                    $hcontrol.set.button($scope.btn.port,$scope.btn.channel,'push');
                    return false;
                })
                .on('touchend touchcancel mouseup', function () {
                    $hcontrol.set.button($scope.btn.port,$scope.btn.channel,'release');
                    return false;
                })
                .on('mouseleave', function (e) {
                    if (e.buttons > 0) {
                        $hcontrol.set.button($scope.btn.port,$scope.btn.channel,'release');
                        return false;
                    }
                })
        },250);
    }
    $scope._to = "";
    $scope.init = function(){
        $scope._to = setTimeout(()=>{
            $scope.set.btnFn();
            $scope.get.button();
        },250);
    }

    $scope._ca = "";
    $scope.codeApply = function(){
        clearTimeout($scope._ca);
        $scope._ca = setTimeout(()=>{
            $scope.$apply();
        },150)
    }

    $scope.$watchCollection('btn',function(newVal,oldVal){
        if (newVal.port !== oldVal.port || newVal.channel !== oldVal.channel){
            $scope.init();
        }
    })

    $scope.$on('channel.event',function(evt,data){
        if (parseInt(data.port) === parseInt($scope.btn.port)){
            if (parseInt($scope.btn.channel) === parseInt(data.channel)){
                switch(data.event){
                    case('state'):{
                        if (data.state){
                            $('#btn_' + $scope.btn.port + "_" + $scope.btn.channel).addClass('active');
                        } else {
                            $('#btn_' + $scope.btn.port + "_" + $scope.btn.channel).removeClass('active');
                        }
                        break;
                    }
                    case('text'):{

                        if (data.newText !== undefined){
                            $scope.btn.oldText = JSON.parse(JSON.stringify($scope.btn.text));
                            $scope.btn.text = data.newText;
                            $scope.codeApply();
                        } else if ($scope.btn.initText !== $scope.btn.text){
                            $scope.btn.text = $scope.btn.initText;
                        }

                        break;
                    }
                    case('enable'):{
                        if (data.state){
                            $('#btn_' + $scope.btn.port + "_" + $scope.btn.channel).removeClass('disabled');
                        } else {
                            $('#btn_' + $scope.btn.port + "_" + $scope.btn.channel).addClass('disabled');
                        }
                        break;
                    }
                    case('show'):{
                        if (data.state){
                            $('#btn_' + $scope.btn.port + "_" + $scope.btn.channel).removeClass('visually-hidden');
                        } else {
                            $('#btn_' + $scope.btn.port + "_" + $scope.btn.channel).addClass('visually-hidden');
                        }
                        break;
                    }
                }
            }
        }
    });

    $scope.init();

}
btnFn.$inject =['$rootScope','$scope','$hcontrol'];
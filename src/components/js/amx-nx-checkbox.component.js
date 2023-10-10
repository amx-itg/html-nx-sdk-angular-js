angular.module('app').directive('amxNxCheckbox',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: cbFn,
        templateUrl:'./components/html/amx-nx-checkbox.component.html'
    }
});
cbFn = function($rootScope,$scope,$hcontrol){
    $scope.cb = ($scope.configuration !== undefined) ? $scope.configuration : {};
    if ($scope.cb.port === undefined) { $scope.cb.port = 1}
    if ($scope.cb.channel === undefined) { $scope.cb.channel = 1}
    ($scope.cb.labelVisible === undefined || !$scope.cb.labelVisible) ? $scope.cb.labelVisible = 'visually-hidden' : $scope.cb.labelVisible = " ";
    if ($scope.cb.text === undefined) { $scope.cb.text = 'Checkbox for Port ' + $scope.cb.port + ' and channel ' + $scope.cb.channel}
    $scope.cb.initText = JSON.parse(JSON.stringify($scope.cb.text));
    ($scope.cb.switch === undefined || $scope.cb.switch) ? $scope.cb.switch = 'form-switch' : "";
    ($scope.cb.inline === undefined || !$scope.cb.inline) ? $scope.cb.inline = " " : $scope.cb.inline = 'form-check-inline';

    $scope.init = function(){
        setTimeout(()=>{
            $('#switch_' + $scope.cb.port + "_" + $scope.cb.channel)
                .unbind('change')
                .on('change',function(){
                $hcontrol.set.button($scope.cb.port,$scope.cb.channel,'push');
                $hcontrol.set.button($scope.cb.port,$scope.cb.channel,'release');
            });

            $hcontrol.get.button($scope.cb.port,$scope.cb.channel);
            $hcontrol.get.button($scope.cb.port,$scope.cb.channel,'text');
            $hcontrol.get.button($scope.cb.port,$scope.cb.channel,'show');
            $hcontrol.get.button($scope.cb.port,$scope.cb.channel,'enable');
        },250);
    }

    $scope.$on('channel.event',function(evt,data) {
        if (parseInt(data.port) === parseInt($scope.cb.port)){
            if (parseInt($scope.cb.channel) === parseInt(data.channel)){
                switch(data.event){
                    case('state'):{
                        $('#switch_' + $scope.cb.port + "_" + $scope.cb.channel).prop("checked", data.state);
                        break;
                    }
                    case('text'):{
                        if (data.newText !== undefined) {
                            $scope.cb.text = data.newText;
                            $scope.codeApply();
                        }
                         else if ($scope.cb.initText !== $scope.cb.text){
                             $scope.cb.text = $scope.cb.initText;
                        }
                        break;
                    }
                    case('enable'):{
                        if (data.state){
                            $('#switch_' + $scope.cb.port + "_" + $scope.cb.channel).removeAttr('disabled');

                        } else {
                            $('#switch_' + $scope.cb.port + "_" + $scope.cb.channel).attr('disabled',true);
                        }
                        break;
                    }
                    case('show'):{
                        if (data.state){
                            $('#switch_' + $scope.cb.port + "_" + $scope.cb.channel).removeClass('visually-hidden');
                        } else {
                            $('#switch_' + $scope.cb.port + "_" + $scope.cb.channel).addClass('visually-hidden');
                        }
                        break;
                    }
                }
            }
        }
    });

    $scope._ca = "";
    $scope.codeApply = function(){
        clearTimeout($scope._ca);
        $scope._ca = setTimeout(()=>{
            $scope.$apply();
        },150)
    }

    $scope.$watchCollection('cb',function(newVal,oldVal){
        if (newVal.port !== oldVal.port || newVal.channel !== oldVal.channel){
            $scope.init();
        }
    })
}
cbFn.$inject =['$rootScope','$scope','$hcontrol'];
angular.module('app').directive('amxNxMeter',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: meterFn,
        templateUrl:'./components/html/amx-nx-meter.component.html'
    }
});

meterFn = function($rootScope,$scope,$hcontrol){
    $scope.mtr = ($scope.configuration !== undefined) ? $scope.configuration : {};
    if ($scope.mtr.port == undefined){ $scope.mtr.port = 1}
    if ($scope.mtr.level == undefined){ $scope.mtr.level = 1}
    if ($scope.mtr.min == undefined){ $scope.mtr.min = 0}
    if ($scope.mtr.max == undefined){ $scope.mtr.max = 255}

    $scope.$watchCollection('mtr',function(newVal,oldVal){
        if (newVal.port !== oldVal.port || newVal.level !== oldVal.level){
            setTimeout(()=>{
                $hcontrol.get.level($scope.mtr.port,$scope.mtr.level);
            },250);

        }
    })

    /*** HCONTROL EVENTS ****/
    $scope.$on('level.event',function(evt,data){
        if (data.port == $scope.mtr.port && data.level == $scope.mtr.level){
            //Int to %
            let v = Math.round((data.value/$scope.mtr.max) * 100);
            $('#progress_' + $scope.mtr.port + "_" + $scope.mtr.level).css('width', v + '%').attr('aria-valuenow', v);
            $scope.mtr.currentValue = v + '%';
            $scope.codeApply();
        }
    });

    $scope._ca = "";
    $scope.codeApply = function(){
        clearTimeout($scope._ca);
        $scope._ca = setTimeout(()=>{
            $scope.$apply();
        },150)
    }


    $hcontrol.get.level($scope.mtr.port,$scope.mtr.level);

}

meterFn.$inject =['$rootScope','$scope','$hcontrol'];
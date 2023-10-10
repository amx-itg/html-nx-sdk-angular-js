angular.module('app').directive('amxNxLevel',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: lvlFn,
        templateUrl:'./components/html/amx-nx-level.component.html'
    }
});
lvlFn = function($rootScope,$scope,$hcontrol){
    $scope.lvl = ($scope.configuration !== undefined) ? $scope.configuration : {};
    if ($scope.lvl.port == undefined){ $scope.lvl.port = 1}
    if ($scope.lvl.level == undefined){ $scope.lvl.level = 1}
    if ($scope.lvl.min == undefined){ $scope.lvl.min = 0}
    if ($scope.lvl.max == undefined){ $scope.lvl.max = 255}
    if ($scope.lvl.changeOn == undefined){$scope.lvl.changeOn = 'input'}



    setTimeout(()=>{
        $('#lvl_' + $scope.lvl.port + "_" + $scope.lvl.level).on($scope.lvl.changeOn,function(e){
            $hcontrol.set.level($scope.lvl.port,$scope.lvl.level,$('#lvl_' + $scope.lvl.port + "_" + $scope.lvl.level).val());
        })
        $hcontrol.get.level($scope.lvl.port,$scope.lvl.level);
    },325)

    $scope.$watchCollection('lvl',function(newVal,oldVal){
        if (newVal.port !== oldVal.port || newVal.level !== oldVal.level){
            $hcontrol.get.level($scope.lvl.port,$scope.lvl.level);
        }
    })


    /*** HCONTROL EVENTS ****/
    $scope.$on('level.event',function(evt,data){
        if (data.port == $scope.lvl.port && data.level == $scope.lvl.level){
            $('#lvl_' + $scope.lvl.port + "_" + $scope.lvl.level).val(data.value);
            $scope.lvl.currentValue = data.value + '%';
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

}
lvlFn.$inject =['$rootScope','$scope','$hcontrol'];
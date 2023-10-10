angular.module('app').directive('amxNxCbGroup',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: cbgFn,
        templateUrl:'./components/html/amx-nx-cb-group.component.html'
    }
});
cbgFn = function($rootScope,$scope,$hcontrol){
    $scope.cbg = ($scope.configuration !== undefined) ? $scope.configuration : {};
    if ($scope.cbg.port === undefined) {$scope.cbg.port = 1}
    if ($scope.cbg.checkboxes === undefined) {$scope.cbg.checkboxes = []}
    if ($scope.cbg.labelVisible === undefined) {$scope.cbg.labelVisible = false}
    if ($scope.cbg.switch === undefined) {$scope.cbg.switch = false}
    if ($scope.cbg.inline === undefined) {$scope.cbg.inline = false}

    $scope.cbg.checkboxes.forEach(function(e){
        e.port = $scope.cbg.port;
        e.labelVisible = $scope.cbg.labelVisible;
        e.switch = $scope.cbg.switch;
        e.inline = $scope.cbg.inline;
    })




}
cbgFn.$inject =['$rootScope','$scope','$hcontrol'];
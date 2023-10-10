angular.module('app').directive('amxNxBtnGrid',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: gridFn,
        templateUrl:'./components/html/amx-nx-btn-grid.component.html'
    }
});
gridFn = function($rootScope,$scope,$hcontrol){
    $scope.grid = ($scope.configuration !== undefined) ? $scope.configuration : {};

    if ($scope.grid.port === undefined) {$scope.grid.port = 1}
    if ($scope.grid.btns === undefined) {$scope.grid.btns = []}

    $scope.grid.size = ($scope.grid.gridSize !== undefined) ? Math.ceil(12/$scope.grid.gridSize) : 4;
    $scope.grid.marginX = ($scope.grid.gridMarginX !== undefined) ? $scope.grid.gridMarginX : 1;
    $scope.grid.marginY = ($scope.grid.gridMarginY !== undefined) ? $scope.grid.gridMarginY : 1;
    $scope.grid.justify = ($scope.grid.gridJustify !== undefined) ? $scope.grid.gridJustify : 'center';

    $scope.grid.btns.forEach(function(e){
        e.port = $scope.grid.port;
    })

}

gridFn.$inject =['$rootScope','$scope','$hcontrol'];
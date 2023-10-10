angular.module('em',[])
    .controller('emulator',emulator);

emulator.$inject = ['$scope','$http','$rootScope','$hcontrol'];
function emulator($scope,$http,$rootScope,$hcontrol) {
    window.scope = $scope;
    window.hcontrol = $hcontrol;
}

angular.module('app').requires.push('em');
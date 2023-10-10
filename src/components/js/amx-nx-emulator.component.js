angular.module('app').directive('amxNxEmulator',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: emu,
        templateUrl:'./components/html/amx-nx-emulator.component.html'
    }
});

emu = function($rootScope,$scope,$http,$hcontrol){

    $scope.btnProps = {
        port:10,
        channel:1000,
        text:"Button Text",
        icon:'bi bi-bar-chart-fill'
    }

    $scope.lvlProps = {
        port:1,
        level:1,
        setValue:255
    }
    $scope.cbProps = {
        port:1,
        channel:100,
        text:"This is the Label",
        labelVisible:true,
        switch:false
    }

    $scope.$on('cbProps',function(nv,ov){
        console.log('em component, cbprops',nv);
    })
}
emu.$inject =['$rootScope','$scope','$hcontrol'];
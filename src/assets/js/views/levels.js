angular.module('lv',[])
    .controller('levels',levels);

levels.$inject = ['$scope','$http','$rootScope','$hcontrol'];
function levels($scope,$http,$rootScope,$hcontrol) {
    console.log('<!== LEVELS LOADED --!>');
    $scope.singleSlider = {
        port:3,
        level:10,
        type:"single",
        skin:"flat",
        color:"bg-secondary",
        min:0,
        max:255,
        from:100,
        step:1,
        grid:false,
        prefix:"",
        postfix:"",
        hide_min_max:true,
        hide_from_to:true,
        prettify:true,
        seperator:',',
        onchange:true,
        onfinish:false
    }
    $scope.doubleSlider = {
        port:3,
        level_1:11,
        level_2:12,
        min:0,
        max:255,
        from:100,
        type:"double",
        grid:true,
        prefix:"",
        postfix:"",
        step:1,
        prettify:true,
        seperator:',',
        onchange:false,
        onfinish:true,
        color:"bg-warning"
    }
    $scope.meter = {
        port:3,
        level:10,
        setValue:100
    }
    levels = $scope;
}

angular.module('app').requires.push('lv');
angular.module('app').directive('amxNxIonSlider',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: ionSliderFn,
        templateUrl:'./components/html/amx-nx-ion-slider.component.html'
    }
});

ionSliderFn = function($rootScope,$scope,$hcontrol){
    $scope.ion = ($scope.configuration !== undefined) ? $scope.configuration : {};

    if ($scope.ion.port === undefined) {$scope.ion.port = 1}
    if ($scope.ion.level === undefined) {$scope.ion.level = 1}
    if ($scope.ion.level_1 === undefined) {$scope.ion.level_1 = 1}
    if ($scope.ion.level_2 === undefined) {$scope.ion.level_2 = 2}
    if ($scope.ion.id === undefined) {$scope.ion.id = "slider_" + Math.floor(Math.random() * Math.random() * 10000)}
    if ($scope.ion.type === undefined) {$scope.ion.type = 'single'}
    if ($scope.ion.skin === undefined) {$scope.ion.skin = 'flat'}
    if ($scope.ion.color === undefined) {$scope.ion.color = 'bg-primary'}

    if ($scope.ion.min === undefined) {$scope.ion.min = 0}
    if ($scope.ion.max === undefined) {$scope.ion.max = 255}
    if ($scope.ion.from === undefined) {$scope.ion.from = 128}
    if ($scope.ion.step === undefined) {$scope.ion.step = 1}

    if ($scope.ion.grid === undefined) {$scope.ion.grid = true}
    if ($scope.ion.grid_num === undefined) {$scope.ion.grid_num = 4}
    if ($scope.ion.grid_snap === undefined) {$scope.ion.grid_snap = true}
    if ($scope.ion.force_edges === undefined) {$scope.ion.force_edges = true}
    if ($scope.ion.hide_min_max === undefined) {$scope.ion.hide_min_max = false}
    if ($scope.ion.hide_from_to === undefined) {$scope.ion.hide_from_to = false}
    if ($scope.ion.prefix === undefined) {$scope.ion.prefix = ''}
    if ($scope.ion.postfix === undefined) {$scope.ion.postfix = ''}
    if ($scope.ion.decorate_both === undefined) {$scope.ion.decorate_both = true}
    if ($scope.ion.values_separator === undefined) {$scope.ion.values_separator = '-'}
    if ($scope.ion.prettify === undefined) {$scope.ion.prettify = true}
    if ($scope.ion.separator === undefined) {$scope.ion.separator = ','}

    if ($scope.ion.onchange === undefined) {$scope.ion.onchange = false}
    if ($scope.ion.onfinish === undefined) {$scope.ion.onfinish = true}

    $scope.$watchCollection('ion',function(newVal,oldVal){
        //console.log('ion updated', $scope.ion.id);
        setTimeout(()=>{
            $('#' + $scope.ion.id).ionRangeSlider({
                port:$scope.ion.port,
                level: $scope.ion.level,
                level_1:$scope.ion.level_1,
                level_2:$scope.ion.level_2,
                oc:$scope.ion.onchange,
                of:$scope.ion.onfinish,
                sliding:false,
                type: $scope.ion.type,
                skin: $scope.ion.skin,
                min: $scope.ion.min,
                max: $scope.ion.max,
                oldVal:{
                   from:$scope.ion.min,
                   to:$scope.ion.max
                },
                from: $scope.ion.from,
                step: $scope.ion.step,
                grid: $scope.ion.grid,
                force_edges: $scope.ion.force_edges,
                hide_min_max: $scope.ion.hide_min_max,
                hide_from_to: $scope.ion.hide_from_to,
                prefix: $scope.ion.prefix,
                postfix: $scope.ion.postfix,
                decorate_both: $scope.ion.decorate_both,
                values_separator: $scope.ion.values_separator,
                prettify: $scope.ion.prettify,
                separator: $scope.ion.separator,
                onUpdate:function(data){
                    this.setColor();
                },
                onStart:function(data){
                    this.setColor();
                    if (this.type === 'single'){
                        $hcontrol.get.level(this.port,this.level);
                    } else if (this.type === 'double'){
                        $hcontrol.get.level(this.port,this.level_1);
                        $hcontrol.get.level(this.port,this.level_2);
                    }

                },
                setColor:function(){
                    let bgc = $('#' + 'color_' + $scope.ion.id).css('background-color');
                    let container = "#container_" + $scope.ion.id;
                    //console.log(container,bgc);
                    if (this.type === 'single'){
                        $(container).find('.irs-bar--single').css('background-color', bgc);
                        $(container).find('.irs-single').css('background-color', bgc);
                        $(container).find('.irs-handle > i:first-child').css('background-color', bgc);
                    } else if (this.type === 'double'){
                        $(container).find('.irs-bar').css('background-color', bgc);
                        $(container).find('.irs-from').css('background-color', bgc);
                        $(container).find('.irs-to').css('background-color', bgc);
                        $(container).find('.irs-handle > i:first-child').css('background-color', bgc);
                    }
                },
                hctrlevent:function(data){
                    if (this.type === 'single'){
                        $hcontrol.set.level(this.port,this.level,data.from);
                    } else if (this.type === 'double') {
                        console.log('Double Event');
                        if (data.from !== this.oldVal.from){
                            $hcontrol.set.level(this.port,this.level_1,data.from);
                            this.oldVal.from = data.from;
                        }
                        if (data.to !== this.oldVal.to){
                            $hcontrol.set.level(this.port,this.level_2,data.to);
                            this.oldVal.to = data.to;
                        }
                    }

                },
                onChange(data){
                    this.sliding = true;
                    if (this.oc){
                        this.hctrlevent(data);
                    }

                },
                onFinish(data){
                    this.sliding = false;
                    if (this.of){
                        this.hctrlevent(data);
                    }
                }
            })
        },25)

    })

    $scope.$on('level.event',function(evt,data){
        if (parseInt(data.port) === parseInt($scope.ion.port)){
            if ($scope.ion.type === 'single'){
                if (parseInt(data.level) === parseInt($scope.ion.level)){
                    if (!$('#' + $scope.ion.id).data('ionRangeSlider').options.sliding){
                        $('#' + $scope.ion.id).data('ionRangeSlider').update({from:parseInt(data.value)});
                    }

                }
            } else if ($scope.ion.type === 'double') {
                if (parseInt(data.level) === parseInt($scope.ion.level_1)){
                    if (!$('#' + $scope.ion.id).data('ionRangeSlider').options.sliding) {
                        $('#' + $scope.ion.id).data('ionRangeSlider').update({from: parseInt(data.value)});
                    }
                } else if (parseInt(data.level) === parseInt($scope.ion.level_2)){
                    if (!$('#' + $scope.ion.id).data('ionRangeSlider').options.sliding) {
                        $('#' + $scope.ion.id).data('ionRangeSlider').update({to: parseInt(data.value)});
                    }
                }
            }
        }
    });
}

ionSliderFn.$inject =['$rootScope','$scope','$hcontrol'];
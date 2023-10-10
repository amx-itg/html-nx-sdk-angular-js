angular.module('app').directive('amxNxBtnGroup',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: groupFn,
        templateUrl:'./components/html/amx-nx-btn-group.component.html'
    }
});
groupFn = function($rootScope,$scope,$hcontrol){
    $scope.group = ($scope.configuration !== undefined) ? $scope.configuration : {};
    if ($scope.group.port === undefined) {$scope.group.port = 1}
    if ($scope.group.btns === undefined) {$scope.group.btns = []}

    $scope.group._dir = ($scope.group.direction !== undefined) ? $scope.group.direction : "button-group";

    $scope.group.btns.forEach(function(e){
        e.port = $scope.group.port;
        e.initText = JSON.parse(JSON.stringify(e.text));
        e.style = (e.style !== undefined) ? e.style : 'btn-primary';
    })

    $scope.loaded = function(){
        //console.log("Btn Group Loaded");
        setTimeout(()=>{$scope.set.btnFn()},350);

    }

    $scope.get = {};
    $scope.set = {};

    $scope.get.button = function(channel){
        $hcontrol.get.button($scope.group.port,channel,'show');
        $hcontrol.get.button($scope.group.port,channel,'enable');
        $hcontrol.get.button($scope.group.port,channel,'text');
        $hcontrol.get.button($scope.group.port,channel);
    }

    $scope.set.btnFn = function(){
        $scope.group.btns.forEach(function(e){
            $('#btn_' + e.port + "_" + e.channel)
                .unbind()
                .bind('touchstart mousedown', function () {
                    $hcontrol.set.button(e.port,e.channel,'push');
                    return false;
                })
                .on('touchend touchcancel mouseup', function () {
                    $hcontrol.set.button(e.port,e.channel,'release');
                    return false;
                })
                .on('mouseleave', function (ev) {
                    if (ev.buttons > 0) {
                        $hcontrol.set.button(e.port,e.channel,'release');
                        return false;
                    }
                })
            $scope.get.button(e.channel);
        })
    }

    $scope._ca = "";
    $scope.codeApply = function(){
        clearTimeout($scope._ca);
        $scope._ca = setTimeout(()=>{
            $scope.$apply();
        },150)
    }

    $scope.$on('channel.event',function(evt,data){
        if (parseInt(data.port) === parseInt($scope.group.port)){
            for (var b of $scope.group.btns){
                if (parseInt(data.channel) === parseInt(b.channel)){
                    switch(data.event){
                        case('state'):{
                            if (data.state){
                                $('#btn_' + $scope.group.port + "_" + b.channel).addClass('active');
                            } else {
                                $('#btn_' + $scope.group.port + "_" + b.channel).removeClass('active');
                            }
                            break;
                        }

                        case('text'):{

                            if (data.newText !== undefined){
                                b.oldText = JSON.parse(JSON.stringify(b.text));
                                b.text = data.newText;
                                $scope.codeApply();
                            } else if (b.initText !== b.text){
                                b.text = b.initText;
                                $scope.codeApply();
                            }

                            break;
                        }


                        case('enable'):{
                            if (data.state){
                                $('#btn_' + $scope.group.port + "_" + b.channel).removeClass('disabled');
                            } else {
                                $('#btn_' + $scope.group.port + "_" + b.channel).addClass('disabled');
                            }
                            break;
                        }
                        case('show'):{
                            if (data.state){
                                $('#btn_' + $scope.group.port + "_" + b.channel).removeClass('visually-hidden');
                            } else {
                                $('#btn_' + $scope.group.port + "_" + b.channel).addClass('visually-hidden');
                            }
                            break;
                        }
                    }
                }
            }
        }
    })
}
groupFn.$inject =['$rootScope','$scope','$hcontrol'];
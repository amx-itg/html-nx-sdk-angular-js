angular.module('app').directive('amxNxRadioGroup',function(){
    return {
        restrict:'E',
        scope:{
            configuration:'='
        },
        controller: radioGroupFn,
        templateUrl:'./components/html/amx-nx-radio-group.component.html'
    }
});

radioGroupFn = function($rootScope,$scope,$hcontrol){
    $scope.rg = ($scope.configuration !== undefined) ? $scope.configuration : {};
    if ($scope.rg.port === undefined) {$scope.rg.port = 1}
    if ($scope.rg.listName === undefined) {$scope.rg.listName = "radiolist_" + Math.floor(Math.random() * Math.random() * 10000)}
    if ($scope.rg.labelVisible === undefined) {$scope.rg.labelVisible = false}
    if ($scope.rg.inline === undefined) {$scope.rg.inline = true}
    if ($scope.rg.list === undefined) {$scope.rg.list = []}

    $scope.init = function(){
        setTimeout(()=>{
            $scope.rg.list.forEach(function(e,i){
                //console.log('#radio_' + $scope.rg.listName + '_' + i);
                e.checked = false;
                e.initText = JSON.parse(JSON.stringify(e.text));
                $('#radio_' + $scope.rg.listName + '_' + i)
                    .unbind('change')
                    .on('change',function(){
                        $hcontrol.set.button($scope.rg.port,e.channel,'push');
                        $hcontrol.set.button($scope.rg.port,e.channel,'release');
                    })

                $hcontrol.get.button($scope.rg.port,e.channel);
                $hcontrol.get.button($scope.rg.port,e.channel,'text');
                $hcontrol.get.button($scope.rg.port,e.channel,'show');
                $hcontrol.get.button($scope.rg.port,e.channel,'enable');
            })
        },500);
    }

    $scope.init();

    $scope._ca = "";
    $scope.codeApply = function(){
        clearTimeout($scope._ca);
        $scope._ca = setTimeout(()=>{
            $scope.$apply();
        },150)
    }

    $scope.$on('channel.event',function(evt,data){
        if (parseInt(data.port) === parseInt($scope.rg.port)){
            for (var b of $scope.rg.list){
                if (parseInt(data.channel) === parseInt(b.channel)){
                    switch(data.event){
                        case('state'):{
                            console.log('Updating List',b,data.state);
                            b.checked = !!data.state;
                            break;
                        }

                        case('text'):{
                            console.log('Text',data.newText);
                            if (data.newText !== undefined){
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
                                $('#btn_' + $scope.rg.port + "_" + b.channel).removeClass('disabled');
                            } else {
                                $('#btn_' + $scope.rg.port + "_" + b.channel).addClass('disabled');
                            }
                            break;
                        }
                        case('show'):{
                            if (data.state){
                                $('#btn_' + $scope.rg.port + "_" + b.channel).removeClass('visually-hidden');
                            } else {
                                $('#btn_' + $scope.rg.port + "_" + b.channel).addClass('visually-hidden');
                            }
                            break;
                        }
                    }
                }
            }
        }
    })
    rgs = $scope;

}

radioGroupFn.$inject =['$rootScope','$scope','$hcontrol'];
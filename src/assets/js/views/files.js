angular.module('fi',[])
    .controller('files',files);

files.$inject = ['$scope','$http','$rootScope','$hcontrol'];
function files($scope,$http,$rootScope,$hcontrol) {
    console.log('<!== FILES LOADED --!>');

    $scope.smde = new SimpleMDE({
        element: $('#config-file-editor')[0],
        initialValue:"Click Button to Fetch the file",
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
        }
    })
    $scope.getFile = function(){
        $hcontrol.get.file('/config');
    }

    $scope.$on('hcontrol.file',function(e,data){
        console.log("File Received",data);
        $scope.file = JSON.parse(data);
        $scope.smde.value(data);
    })

    fScope = $scope;

}

angular.module('app').requires.push('fi');
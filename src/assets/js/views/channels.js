angular.module('ch',[])
    .controller('channels',channels);

channels.$inject = ['$scope','$http','$rootScope'];
function channels($scope,$http,$rootScope) {
    console.log('<!== CHANNELS LOADED --!>');

    $scope.btnConfig = {port:2,channel:501,text:'Single Button', style:"btn-secondary"}

    $scope.btnGridConfig = {
        port:2,
        gridSize:4, //Valid Sizes 1,2,3,4,6,12
        gridMarginX:1, //Valid Size 1 - 5;
        gridMarginY:1, //Valid Size 1 - 5;
        btns:[
            {channel:502,text:'Button', style:"btn-primary"},
            {channel:503,text:'Button', style:"btn-secondary"},
            {channel:504,text:'Button', style:"btn-info"},
            {channel:505,text:'Button', style:"btn-warning"},
            {channel:506,text:'Button', style:"btn-danger"},
            {channel:507,text:'Button', style:"btn-dark"},
            {channel:508,text:'Button', style:"btn-light"},
            {channel:509,text:'Button', style:"btn-link"},
            {channel:510,text:'Button', style:"btn-outline-primary"},
            {channel:511,text:'Button', style:"btn-outline-secondary rounded-pill"},
            {channel:512,text:'Button'},
            {channel:513,text:'Button'}
        ]
    }
    $scope.btnGroupConfig = {
        port:2,
        direction:"btn-group",
        btns:[
            {channel:514,text:'One', icon:"bi bi-airplane"},
            {channel:515,text:'Two', icon:"bi bi-android2"},
            {channel:516,text:'Three', icon:"bi-chat-right-dots-fill"},
            {channel:517,text:'Four', icon:"bi bi-alarm"}
        ]
    }
    $scope.cbConfig = {
        port:2,
        channel:518,
        labelVisible:true,
        text:"This is a Checkbox",
        switch:false,
        inline:true
    }
    $scope.cbGroupConfig = {
        port:2,
        switch:true,
        labelVisible:true,
        checkboxes:[
            {channel:519, text:"ONE"},
            {channel:520, text:"TWO"},
            {channel:521, text:"THREE"}
        ]
    }
    $scope.radioGroupConfig = {
        port:2,
        labelVisible:true,
        inline:true,
        list:[
            {channel:522, text:"RADIO ONE"},
            {channel:523, text:"RADIO TWO"}
        ]
    }

    $scope.testingButtons = [
        {
            port:12,
            direction:"btn-group",
            btns:[
                {channel:100,text:'Show'},
                {channel:101,text:'Hide'},
            ]
        },
        {
            port:12,
            direction:"btn-group",
            btns:[
                {channel:102,text:'Enable'},
                {channel:103,text:'Disable'},
            ]
        },
        {
            port:12,
            direction:"btn-group",
            btns:[
                {channel:104,text:'ON'},
                {channel:105,text:'OFF'},
            ]
        },
        {
            port:12,
            direction:"btn-group",
            btns:[
                {channel:106,text:'Set Text'}
            ]
        }
    ]

}

angular.module('app').requires.push('ch');
angular.module('app')
    .factory('$hcontrol',['$rootScope','$http','$websocket',function($rootScope,$http,$websocket){
        let $hc = {};

        /********* CONTROLLER DETAILS ***********/

        $hc.version = 'v1.0.1';
        $hc.controller = {};
        $hc.controller.mode = false;
        $hc.controller.set = {};
        $hc.controller.get = {};
        $hc.controller.closeAllow = false;


        $hc.controller.set.internal = function(autoConnect){
            $http.get('config?websocket')
                .then(function success(response){
                    console.log('Internal Connection SUCCESS',response);
                    $hc.controller.host = response.data.websocket.host;
                    $hc.controller.path = response.data.websocket.path;
                    $hc.controller.port = response.data.websocket.port;

                    //TODO - Still Needed?
                    if ($hc.controller.host !== location.hostname) $hc.controller.host = location.hostname;
                    $hc.controller.mode = 'internal';
                    if (autoConnect){
                        $hc.controller.init();
                    }
                },function error(response){
                    console.log("Internal Connection ERROR",response);
                    $rootScope.$broadcast('hcontrol.connection',{"type":"connection","message":"Hosted Connection Error"});
                })
        }
        $hc.controller.get.externalCredentials = function(url,autoConnect){
            $http.get(url)
                .then(function success(response){
                    $hc.controller.url = response.data.url;
                    $hc.controller.key = response.data.key;
                    $hc.controller.username = response.data.username;
                    $hc.controller.password = response.data.password;
                    if (autoConnect){
                        $hc.controller.set.external($hc.controller.url, $hc.controller.key,$hc.controller.username,$hc.controller.password);
                        $hc.controller.init();
                    }

                },function error(response){
                    console.log("Error, Configuration File doesn't exist",url);
                })
        }

        $hc.controller.set.external = function (url, key, uname,pword){
            let RSAEncrypt = new JSEncrypt();
            RSAEncrypt.setPublicKey(key);
            let token = {};
            token.username = uname;
            token.password = RSAEncrypt.encrypt(pword);
            token = btoa(JSON.stringify(token));
            //$hc.controller.url = url;
            $hc.controller.token = token;
            $hc.controller.mode = 'external';
        }

        $hc.controller.init = function(){
            $hc.controller.connectSecurity = (location.protocol.search(/https/) !== -1) ? 'wss://' : 'ws://';

            switch($hc.controller.mode){
                default:{
                    console.log('Error, Connection Type NOT Defined by controller.set functions!');
                    $rootScope.$broadcast('hcontrol.connection',{"type":"error","message":"Type Not Set by controller.set functions!"});
                    break;
                }
                case('external'):{
                    $hc.connection = $websocket($hc.controller.connectSecurity + $hc.controller.url + '?token=' + $hc.controller.token, { rejectUnauthorized: false });
                    break;
                }
                case('internal'):{
                    console.log('Updated Message: ID - 1');
                    console.log("internal Connection: ",$hc.controller.connectSecurity + $hc.controller.host + ':' + $hc.controller.port + $hc.controller.path);
                    $hc.connection = $websocket($hc.controller.connectSecurity + $hc.controller.host + ':' + $hc.controller.port + $hc.controller.path);
                    break;
                }
            }

            $hc.connection.onMessage(function(message){
               $rootScope.$broadcast('hcontrol.log',{"direction":"in", msgType:message.data.split(/(?<=^\S+)\s/)[0], data:JSON.parse(message.data.split(/(?<=^\S+)\s/)[1])});

               $hc.parseResponse(message);
            })
            $hc.connection.onOpen(function(){
                $rootScope.$broadcast('hcontrol.connection',{"type":"connection","message":"connected"});
                $hc.keepAlive.send();
            })
            $hc.connection.onClose(function(){
                $rootScope.$broadcast('hcontrol.connection',{"type":"connection","message":"disconnected"});
                if (!$hc.controller.closeAllow){
                    $hc.connection.reconnect();
                }
            })
            $hc.connection.onError(function(error){
                $rootScope.$broadcast('hcontrol.connection',{"type":"connection","message":"error"});
                console.log("Connection Error",error);
            })

            $hc.controller.close = function(){
                $rootScope.$broadcast('hcontrol.connection',{"type":"connection","message":"closed"});
                $hc.controller.closeAllow = true;
                $hc.connection.close();
            }
            $hc.keepAlive = {
                to:'',
                interval:120000,
                params:["version"],
                send:function(){
                    clearTimeout($hc.keepAlive.to);
                    $hc.keepAlive.to = setInterval(()=>{
                        let disco = {"params": this.params};
                        $hc.controller.send('disco ' + JSON.stringify(disco));
                    },this.interval)
                }
            }
            $hc.controller.send = function(str){
                $rootScope.$broadcast('hcontrol.log',{"direction":"out", msgType:str.split(/(?<=^\S+)\s/)[0], "data":JSON.parse(str.split(/(?<=^\S+)\s/)[1])});
                $hc.connection.send(str);
                $hc.keepAlive.send();
            }
            $hc.controller.getAuth = function(){
                $hc.getAuth = function(){
                    let disco = {"params":["auth"]};
                    $hc.controller.send('disco ' + JSON.stringify(disco));
                }
            }
            window.addEventListener('onbeforeunload',function(){
                console.log('Closing Connection to NX Controller');
                $hc.controller.close();
            })


        }

        /************** HCONTROL ************/

        $hc.get = {};
        $hc.set = {};
        $hc.types = ['button','level','passthru','command','page'];

        $hc.get.button = function(port,channel,property){
            port = (port === undefined)        ? 0 : port;
            channel = (channel === undefined)  ? 0 : channel;
            property = (property === undefined) ? 'channel' : property;

            let cmd = 'get ';
            let details = {
                "path":"/button/" + port + "/" + channel + '/' + property
            }
            $hc.controller.send(cmd + JSON.stringify(details));
        }
        $hc.get.level = function(port,level,property){
            port = (port === undefined) ? 0 : port;
            level = (level === undefined) ? 0 : level;
            property = (property === undefined) ? 'level' : property

            let cmd = 'get ';
            let details = {
                "path":"/level/" + port + "/" + level + '/' + property
            }

            $hc.controller.send(cmd + JSON.stringify(details));
        }
        $hc.get.page = function(){
            let cmd = 'get ';
            let details = {
                path:"/page/emulator"
                //value: true
            }
            $hc.controller.send(cmd + JSON.stringify(details));
        }
        $hc.get.passThru = function(items){

        }

        $hc.get.file = function(filePath){
            let cmd = 'getfile ';
            let details = {
                "path":filePath,
                "state":"begin"
            }

            $hc.controller.send(cmd + JSON.stringify(details));
        }
        $hc.set.button = function(port,channel,value){
            port = (port === undefined) ? 1 : port;
            channel = (channel === undefined) ? 1 : channel;
            value = $hc.conformChannelValue(value);
            let cmd = 'set ';
            let details = {
                path:"/button/" + port + '/' + channel + '/button',
                value:value
            }
            $hc.controller.send(cmd + JSON.stringify(details));
        }

        $hc.conformChannelValue = function(value){
            let pushEvent    = [1,'1',true,'on','push','pushed','press','pressed','go'];
            let releaseEvent = [0,'0',false,'off','release','released','stop','not pressed'];
            if (pushEvent.indexOf(value.toLowerCase()) !== -1){
                value = 'press';
            } else if (releaseEvent.indexOf(value.toLowerCase()) !== -1){
                value = 'release';
            } else {
                console.log('VALUE NOT CONFORMED:' + value);
                value = 'press';
            }
            return value;
        }
        $hc.set.level = function(port,level,value){
            port = (port === undefined) ? 1 : port;
            level = (level === undefined) ? 1 : level;
            value = (value === undefined) ? 125 : value;
            (value > 255) ? value = 255 : (value < 0) ? value = 0 : value;

            let cmd = 'set ';
            let details = {
                path:"/level/" + port + '/' + level + '/level',
                value:value
            }
            $hc.controller.send(cmd + JSON.stringify(details));

        }

        $hc.set.PassThru = function(items){

        }

        $hc.tFile = '';
        $hc.pfTO = '';
        $hc.parseFileResponse = function(message){
            try {
                let type = message.data.split(' ')[0].replace('@','').trim();
                let obj  = message.data.split(' ')[1];
                obj = JSON.parse(obj);

                if (type === 'getfile' && obj.state === 'begin'){
                    $hc.tFile = ''
                } else if (type === 'block') {
                    $hc.tFile += obj.data;
                }
                clearTimeout($hc.pfTO);
                $hc.pfTO = setTimeout(()=>{
                    //console.log('pfto');
                    $hc.tFile = atob($hc.tFile);
                    $rootScope.$broadcast('hcontrol.file',$hc.tFile);
                },150)
            } catch(error){
                $hc.log.message('error',{path:"Error Parsing File - check console","value":"error"});
                console.log('PARSE FILE RESPONSE ERROR: - hcontrol return',message.data,error);
            }



        }
        $hc.parseResponse = function(message){
            try {
                //console.log('Incoming Message:',message);
                let type = message.data.split(/(?<=^\S+)\s/)[0].replace('@','').trim();
                let obj  = message.data.split(/(?<=^\S+)\s/)[1];

                if (type === 'disco'){
                    let obj = message.data.split('@disco')[1];
                    obj = JSON.parse(obj);
                    if (obj.auth !== undefined){
                        let authObj = {
                            warn:obj.auth.warn,
                            reason:obj.auth.reason,
                            mode:obj.auth.mode
                        }
                        //Delay for initial load of template/and/or footer
                        setTimeout(()=>{$hc.broadcast.auth(authObj)},750);
                    }
                } else {
                    obj = JSON.parse(obj);
                    if (type === 'block' || type === 'getfile'){
                        $hc.parseFileResponse(message);
                    } else {
                        if (Array.isArray(obj)){
                            for (var rx of obj){
                                $hc.conformBroadcast(type,rx.path,rx.value);
                                //$hc.log.message('in',{path:rx.path,value:rx.value});
                            }
                        } else {
                            if (obj.version !== undefined){
                                //Handle DISCO response?
                            }
                            else {
                                $hc.conformBroadcast(type,obj.path,obj.value);
                            }
                        }
                    }
                }
            } catch(error){
                console.log('PARSE RESPONSE ERROR: - hcontrol return',message.data,error);
                console.log(message.data);
                $hc.errorMessage = message.data;
            }
        }
        $hc.conformBroadcast = function(type,path,value){

            if (type == 'publish' || type == 'get') {
                path = path.split('/');
                let bcType = path[1];
                let bcPort = path[2];
                let bcElem = path[3];
                let bcProperty = path[4];
                let bcVal =  value;

                switch(bcType){
                    default:{
                        $hc.broadcast[bcType][bcProperty](bcPort, bcElem, bcVal);
                        break;
                    }
                    case('page'):{
                        $hc.broadcast[bcType](bcPort);
                        break;
                    }
                }

            }
        }

        $hc.broadcast = {
            button:{
                channel:function(port,channel,state){
                    $rootScope.$broadcast('channel.event',{"event":"state",port,channel,state});
                },
                text:function(port,channel,newText){
                    //console.log('Text,',port,channel,newText);
                    $rootScope.$broadcast('channel.event',{"event":"text",port,channel,newText})
                },
                enable:function(port,channel,state){
                    $rootScope.$broadcast('channel.event',{"event":"enable",port,channel,state});
                },
                show:function(port,channel,state){
                    $rootScope.$broadcast('channel.event',{"event":"show",port,channel,state});
                }
            },
            level:{
                level:function(port,level,value){
                    $rootScope.$broadcast('level.event',{port,level,value});
                }
            },
            log:function(){
                $rootScope.$broadcast('logUpdates');
            },
            auth:function(opts){
                $rootScope.$broadcast('hcontrol.auth',opts);
            },
            page:function(opts){
                $rootScope.$broadcast('page.event',opts);
            }
        }

        return $hc;

}])
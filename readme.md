# AMX-NX-HTML5-SDK ANGULARJS 

## Introduction:
AMX has released three different versions of the HTML SDK designed to work with AMX Netlinx Controllers Over a websocket.  This version is AngularJS
More details on AngularJS can be found here - https://angularjs.org/
### PLEASE NOTE:
Configuration of a Netlinx processor is required.  This project can reside on the Netlinx processor itself (Follow directions to prepare and load the project per the instructions with the websocket module.  It can also be hosted on any web host capable of reaching the Netlinx processor.  The processor should be configured prior to beginning working with SDK and the Websocket serivce.

### npm install
 - Install latest version of node 18.16+
 - Ensure that you have `npm`
 - Run `npm install`

## HTML Build:
 - Run `gulp build`
 - Runs the app in the development mode.
 - Open [http://localhost:4200](http://localhost:4200) to view it in your browser

## HTML Configuration:
When hosted on the Netlinx controller - the controller.json file found in ** assets/configuration/ ** should be deleted.
When hosted off of the Netlinx controller, the controller.json file should be updated with the Username/Password and Security key of the Netlinx Controller.


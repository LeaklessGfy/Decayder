# Decayder
Decayder is the FurezLegacy project on Electron

##Main Goal ?
Decayder clearly want to reach the top of web backdoor (Warthog lib on the way to help)

##Furez ?
FurezApi Framework is a little PHP backdoor that allow you to exploit file upload vulnerability on web server. The main goal is pretty simple : Test every possibilities of infected files to upload, and then, if the upload is successful:

- giving you a user interface to manage datas
- allowing you to do what you want on server

Show the folder structure of the website ? Show a specific file ? Zip content ? Download content ? Upload or even delete ? If the API succeed to be upload on the server. You're the new king of this one!

##Why Decayder ?
Where FurezApi Framework and later FurezExploit (C++ brother) were boring and long to setup and install, Decayder learnt about those mistakes and fix it. Decayder giving you a better interface to handle the server return and manage it. Get all former functionnalities but make it easier to install, faster to use, better to customize and soon hot new functionnalities:
- Encoding all the request (Crypto.js)
- Infected requests by GET, POST, Headers or Cookies
- Logs every result in file
- Better interface
- Easy to plug bundle and plugin thanks to EventEmitter
- Proxied tunnel

##API
###CMD Interface
doc soon

###Fuzzer
doc soon

###EventEmitter
doc soon

##Binary
Binaries for differents platforms (Linux, Windows and soon or later Mac) will be available in the `./bin` directory. So if you don't want to build the application by yourself you can use it.

On Windows launch: `./bin/decayder.exe`
On linux (in your terminal): (root directory) `./bin/decayder`(root/bin directory) `./decayder`

##Requirements (to build)
These requirements are necessary only if you want to build the app:
- `Node.js && npm`

##Dependencies (to build)
These dependencies are necessary only if you want to build the app:
- `Electron` (interface)
- `Axios.js` (intern call)
- `Gator.js` (DOM event listener)
- `Request` (call infected file)
- `Random-Useragent` (generate random user agent for request)
- `Winston` (log)
- `EventEmitter (wolfy87-eventemitter)` (event listener interface, for easier bundle and plugins)

##Install && Run (to build localy)
These instructions are necessary only if you want to build the app:
- `git clone https://github.com/LeaklessGfy/Decayder.git` (or SSH if you want)
- `cd decayder`
- `npm start`

##Build
Coming soon (please refer to Electron doc)

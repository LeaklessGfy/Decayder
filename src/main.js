const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1500, 
    height: 600, 
    "web-preferences": {
      "web-security": false
    }
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    if (mainWindow) {
      mainWindow.webContents.closeDevTools()
    }

    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let printerWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  printerWindow = new BrowserWindow({width: 800, height: 600, show: false });

  // printerWindow.once('ready-to-show', () => printerWindow.hide())  

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools. name :"EPSON TM-T88V Receipt"
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.webContents.on('did-finish-load', ()=> {
    mainWindow = null;
  })

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

ipcMain.on('getPrinters', (event)=> {
  // event.sender.send('res-printers', mainWindow.webContents.getPrinters())
})

ipcMain.on('print', (event, htmlContent)=> {
    printerWindow.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(htmlContent))
    printerWindow.webContents.on('did-finish-load', () => {
      printerWindow.webContents.print({printBackground: false, deviceName: "EPSON TM-T88V Receipt", silent: false });
      console.log('imprimiendo')
    });
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

/**
 * Obtener todas las impresoras
 * Obtener impresora por defecto
 * Imprimir
 * Obtener estatus de la impresion
 */

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // printerWindow.once('ready-to-show', () => printerWindow.hide())  

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools. name :"EPSON TM-T88V Receipt"
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

/**
 * Get default printer
 * @return PrinterInfo
 */
ipcMain.on('getDetaultPrinter', (event)=> {
  event.sender.send('res-getDetaultPrinter', getDefaultPrinter(mainWindow.webContents.getPrinters()))
})


/**
 * Este metodo usa el metodo print silence para imprimir en la impresora por defecto
 * 
 */
ipcMain.on('print', (event, arrHtmlContents)=> {
    if (arrHtmlContents.length < 1) return
    
    let counterPrints = 0
    let printingInfoArr = []

    for (let htmlContent of arrHtmlContents) {
      let printerWindow = new BrowserWindow({width: 800, height: 600, show: false });
      printerWindow.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(htmlContent))
      printerWindow.webContents.on('did-finish-load', () => {
          printerWindow.webContents.print({printBackground: false, silent: true }, (status)=> {
            counterPrints++
            printingInfoArr.push({
              statusOfPrint: status,
              numOfPrint: counterPrints,
              statusOfPrinter: getDefaultPrinter(printerWindow.webContents.getPrinters()).status
            })
            if (counterPrints === arrHtmlContents.length) {
              event.sender.send('res-print', printingInfoArr)
            }
            printerWindow.close()
          })
      })
    }
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

/**
 *  return printer deafult
 * @param webContents.getPrinters arrPrinters 
 */
function getDefaultPrinter(arrPrinters){
  for (let printer of arrPrinters) {
    if (printer.isDefault) {
      return printer
    }
  }
}
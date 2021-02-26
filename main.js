const { app, BrowserWindow, Menu } = require('electron')

const ipc = require('electron').ipcMain
let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    }
  })

  win.loadFile('src/index.html')
  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        { label: 'File' },
        { label: 'Oops' },
        { type: 'separator' },
        {
          label: 'Quit',
          click() {
            app.quit()
          }
        },
      ]
    }
  ])

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
ipc.on('update-notify-value', function(event, arg){
  win.webContents.send('targetPriceVal', arg)
})
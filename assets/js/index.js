const electron = require('electron')
const path = require('path')
const axios = require('axios')
const BrowserWindow = electron.remote.BrowserWindow
const ipc = electron.ipcRenderer

const newWindowBtn = document.getElementById('notifyBtn')
var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal
var sent = false

const notification = {
  title: 'BTC Alert',
  body: 'BTC just beat your target price!',
  icon: path.join(__dirname, '../assets/images/icon.png')
}

function getBTC() {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
    .then(res => {
      const crypto = res.data.BTC.USD
      price.innerHTML = "$" + crypto.toLocaleString('en')

      if (targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD && sent == false) {
        sent = true
        const myNotification = new window.Notification(notification.title, notification)
      }
    })
}
getBTC()
setInterval(getBTC, 1000);

newWindowBtn.addEventListener('click', (event) => {
  const modalPath = path.join('file://', __dirname, 'add.html')
  let win = new BrowserWindow({
    width: 400,
    height: 320,
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.on('close', () => { win = null })
  win.loadURL(modalPath)
  win.show()
})

ipc.on('targetPriceVal', function (event, arg) {
  targetPriceVal = Number(arg)
  targetPrice.innerHTML = "$" + targetPriceVal.toLocaleString('en')
})
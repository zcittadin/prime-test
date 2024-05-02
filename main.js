const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const dao = require('./db/emp-dao');

let mainWindow
//let timer

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/prime-test/browser/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.on("ready-to-show", () => {
    mainWindow.webContents.openDevTools();
    getAll();
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  //console.log("closed");
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

/* ----------------------------------------- */

function getAll() {
    dao.getAll().then((data) => {
        console.log(data);
    }).catch((error) => console.log(error))
        .finally(console.log('Got!'));
}

/*ipcMain.on('fetch_registers', (event, arg) => {
  dao.getRegisters();
});

ipcMain.on('start_http_client', (event, arg) => {
  timer = setInterval(myInterval, 1000);
});

ipcMain.on('stop_http_client', (event, arg) => {
  clearInterval(timer);
});

ipcMain.on('do_request', (event, arg) => {
  httpGetRegisters();
});*/

/* ----------------------------------------- */

/*function myInterval() {
  httpGetRegisters();
}

function httpGetRegisters() {
  client.httpGet()
    .then(data => {
      console.log(data)
      mainWindow.webContents.send('registers_available', data);
    })
    .catch(err => console.log(err))
    .finally(console.log('End!')
    );
}*/
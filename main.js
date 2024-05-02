const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const dao = require('./db/emp-dao');

let mainWindow

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
    });

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

/* ----------------------------------------- */

ipcMain.on('insert', (event, arg) => {
    dao.insert(arg).then((result) => {
        mainWindow.webContents.send('insert_done', result.dataValues);
        console.log(result.dataValues);
    }).catch((error) => console.log(error))
        .finally(console.log('Insert finished.'));
});

ipcMain.on('update', (event, arg) => {
    dao.update(arg).then((result) => {
        mainWindow.webContents.send('update_done', result);
        console.log(result);
    }).catch((error) => console.log(error))
        .finally(console.log('Update finished.'));
});

ipcMain.on('remove', (event, arg) => {
    dao.remove(arg).then((result) => {
        mainWindow.webContents.send('remove_done', result);
        console.log(result);
    }).catch((error) => console.log(error))
        .finally(console.log('Remove finished.'));
});

ipcMain.on('get_all', (event, arg) => {
    dao.getAll().then((data) => {
        mainWindow.webContents.send('fetch_done', data);
        console.log(data);
    }).catch((error) => console.log(error))
        .finally(console.log('Got!'));
});

/* ----------------------------------------- */

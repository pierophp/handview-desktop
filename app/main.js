'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

let windowManager = require('electron-window-manager');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

    let screen = require('screen');
    let size = screen.getPrimaryDisplay().size;
    let width = size.width;
    let height = size.height;

    //var appIcon = new Tray('logo.png');

    // Create the browser window.
    mainWindow = new BrowserWindow({
        title: 'Hand View',
        icon: 'logo.png',
        width: width,
        height: height,
        webSecurity: false,
        showDevTools: true,
        webPreferences: {
            sharedWorker: true
        }
    });

    let pjson = require('./package.json');
    let electron_version = process.versions['electron'];
    let chrome_version = process.versions['chrome'];
    let app_version = pjson.version;

    let main_url = 'http://localhost/handview/index.php/desktop';
    main_url += '?electron_version=' + electron_version;
    main_url += '&chrome_version=' + chrome_version;
    main_url += '&app_version=' + app_version;
    main_url += '&url=' + encodeURIComponent('http://localhost/handview');

    // and load the index.html of the app.
    mainWindow.loadURL(main_url);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });


    if (screen.getAllDisplays().length > 1) {

        size = screen.getAllDisplays()[1].workAreaSize;

        width = size.width;
        height = size.height;

        var secondScreen = windowManager.createNew('second_screen', 'Hand View Tela Extendida', 'http://localhost/handview/index.php/desktop?second_screen=1&url=' + encodeURIComponent('http://localhost/handview/index.php/second_screen'), false, {
            width: width,
            height: height,
            position: [width, 0],
            fullscreen: true,
            useContentSize: true,
            showDevTools: false,
            webSecurity: false,
            webPreferences: {
                sharedWorker: true
            }
        });

        secondScreen.open();
        secondScreen.onReady(true, function (window) {
            mainWindow.focus();
        });
    }

    mainWindow.focus();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
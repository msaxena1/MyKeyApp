const express = require('express')
const expressApp = express()
const fs = require( 'fs' );
const fileName = '../data/data.json';
const https = require( 'https' );

const options = {
	  key: fs.readFileSync( '../certs/server.key' ),
	  cert: fs.readFileSync( '../certs/server.crt' )
};
expressApp.use(express.json())

expressApp.get('/data', function (req, res) {
  fs.readFile(fileName, { encoding: 'utf8'}, (err, data) => {
    if (err) {
      if ( err.code === 'ENOENT' ) {
        return res.status(200).json({ success: true, data: [] });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  
    return res.status(200).json({ success: true, data: JSON.parse( data ) })
  });

})

expressApp.post('/data', function (req, res, next) {
  fs.writeFile(fileName, JSON.stringify( req.body ), { encoding: 'utf8'}, (err, data) => {
    if (err) {
      console.log(JSON.stringify(err))
      return res.status(500).json({ success: false, error: err });
    }
  
    return res.status(200).json({ success: true })
  });

})

expressApp.use(express.static('build'))
https.createServer( options, expressApp ).listen( 3000 );
//expressApp.listen(3000)

const path = require('path');

/////
// Modules to control application life and create native browser window
if ( path.basename(process.argv0, '.exe') === 'electron' ) {

const {app, BrowserWindow} = require('electron')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('./build/index.html')
  mainWindow.loadURL('http://localhost:3001')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
}

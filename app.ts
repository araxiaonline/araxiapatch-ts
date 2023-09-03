import { app, BrowserWindow } from 'electron';
import { download } from 'electron-dl';

// Files to download
const files: string[] = [
  'info.txt',
  'patch-4.mpq',
  'patch-5.mpq',
  'patch-7.mpq',
  'patch-9.mpq',
  'patch-B.mpq',
  'patch-C.mpq',
  'patch-D.mpq',
  'patch-F.mpq',
  'patch-G.mpq',
  'patch-J.mpq',
  'patch-L.mpq',
  'patch-S.mpq',
  'patch-T.mpq',
  'patch-U.mpq',
];

const patchSource = 'https://storage.googleapis.com/araxia-client-patches/';
const appName = 'Araxia Client Patch Downloader';

let mainWindow: BrowserWindow | null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Handle the close button click
  mainWindow.on('close', function (e) {
    // Prevent the window from closing immediately
    e.preventDefault();
    app.quit();
  });
}

// Create the main window when the app is ready
app.on('ready', createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create a new window when the app is activated (on macOS)
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle file downloads
app.on('ready', function () {
  // Specify the directory where files will be downloaded
  const directory = app.getPath('userData');

  // Download each file in parallel
  files.forEach((file, index) => {
    download(mainWindow, patchSource + file, { directory, filename: file })
      .then(() => {
        // File downloaded successfully
        console.log(`File ${file} downloaded.`);
        mainWindow?.webContents.send('update-progress', { index, progress: 100 });
      })
      .catch((error) => {
        // Error occurred during download
        console.error(`Error downloading file ${file}: ${error}`);
      });
  });
});

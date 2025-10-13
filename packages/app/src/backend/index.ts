import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { app, BrowserWindow, shell } from 'electron'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


let mainWindow: BrowserWindow | null = null

const installExtensions = async () => {
  const options = {
    forceDownload: true,
    loadExtensionOptions: { allowFileAccess: true }
  }

  await installExtension([
    REDUX_DEVTOOLS,
    REACT_DEVELOPER_TOOLS
  ], options)
    .then(name => console.log(`Added Extension: ${name}`))
    .catch(err => console.log('An error occured: ', err.toString()))
}

async function createWindow() {
  console.log('Electron __dirname:', __dirname)

  mainWindow = new BrowserWindow({
    width: 960,
    height: 780,
    minWidth: 960,
    minHeight: 260,

    show: false,
    frame: false,
    transparent: true,
    hasShadow: true,

    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    backgroundColor: '#15181F',
    trafficLightPosition: {
      x: 15,
      y: 20
    },

    webPreferences: {
      //preload: join(__dirname, '../preload/index.cjs'),
      preload: join(__dirname, './preload.cjs'),
      experimentalFeatures: true,
      sandbox: false,
    }
  })

  if (import.meta.env.DEV) {
    const pkg = await import('../../package.json')
    const url = [
      'http://',
      `${pkg.env.HOST || '127.0.0.1'}:`,
      pkg.env.PORT
    ].join('')

    mainWindow.loadURL(url)
    mainWindow.webContents.openDevTools()

  } else {
    mainWindow.loadFile(join(__dirname, './index.html'))
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow!.show()
    mainWindow!.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Make all links open in the browser, not in the app itself
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(async () => {
  await installExtensions()
  createWindow()
})

app.on('window-all-closed', () => {
  mainWindow = null

  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()

  if (allWindows.length) allWindows[0].focus()
  else createWindow()
})

app.on('second-instance', () => {
  if (mainWindow) mainWindow.isMinimized()
    ? mainWindow.restore()
    : mainWindow.focus()
})

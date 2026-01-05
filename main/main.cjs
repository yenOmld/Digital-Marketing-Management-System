const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

function createWindow () {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    icon: path.join(__dirname, 'assets/icon.png'), // 应用图标
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    show: false, // 先不显示窗口，等加载完成后再显示
    titleBarStyle: 'default'
  })

  // 窗口加载完成后显示
  win.once('ready-to-show', () => {
    win.show()
    
    // 开发环境下打开开发者工具
    if (isDev) {
      win.webContents.openDevTools()
    }
  })

  // 加载应用
  if (isDev) {
    win.loadURL('http://localhost:5173') // Vite 开发服务器地址
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'))
  }

  // 设置窗口标题
  win.setTitle('数字营销管理系统')
}

// 创建应用菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            require('electron').dialog.showMessageBox({
              type: 'info',
              title: '关于',
              message: '数字营销管理系统',
              detail: '版本 1.0.0\n一个现代化的营销管理平台'
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  createMenu()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
const isDev = require('electron-is-dev');

const Can = require('cs-pcan-usb');
const { dialog } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    minWidth: 1050,
    height: 800,
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.menuBarVisible = false
  
  let can = new Can({
    canRate: 500000,
  });

  can.list()
  .then((ports : any) => can.open(ports[0].path).catch((error : any) => {
    dialog.showMessageBox(win, {"title" : "Errore!", "message" : "Impossibile aprire interfaccia CAN."}).then((retval) => app.quit())
  }))
  .then(() => {
    ipcMain.on('send-can-rqst', (evt,
      Potential_Selection,
      Power_Faults_A_Request,
      Power_Faults_B_Request,
      Signal_Faults_A_Request,
      Signal_Faults_B_Request) => {
        Promise.all([
          can.write(Potential_Selection),
          can.write(Power_Faults_A_Request),
          can.write(Power_Faults_B_Request),
          can.write(Signal_Faults_A_Request),
          can.write(Signal_Faults_B_Request)
        ]).catch((error) => {
          dialog.showMessageBox(win, {"title" : "Errore!", "message" : "Errore nell'invio dei messaggi"}).then((retval) => {can.close(); app.quit()})
        })
    })
    setInterval(() => {
      can.write({id : 0x7F8, ext : false, buf : Buffer.from(Array(8).fill(0))}).catch(() => {}).catch(() => {
        dialog.showMessageBox(win, {"title" : "Errore!", "message" : "Impossibile inviare messaggi sul CAN."}).then((retval) => {can.close(); app.quit()})
      })
    }, 1000)
  }).catch((error : any) => {
    dialog.showMessageBox(win, {"title" : "Errore!", "message" : "Impossibile aprire interfaccia CAN."}).then((retval) => {can.close(); app.quit()})
  })

  can.on("data", (msg : any) => {
    switch (msg.id) {
      case 0x7F6:
        win.webContents.send('board-a-status', [...msg.buf])
        break

      case 0x7F7:
        win.webContents.send('board-b-status', [...msg.buf])
        break

      case 0x7F9:
        win.webContents.send('potential-selection', [...msg.buf])
        break

      case 0x7FB:
        win.webContents.send('power-faults-a', [...msg.buf])
        break

      case 0x7FD:
        win.webContents.send("power-faults-b", [...msg.buf])
        break

      case 0x7FA:
        win.webContents.send('signal-faults-a', [...msg.buf])
        break

      case 0x7FC:
        win.webContents.send("signal-faults-b", [...msg.buf])
        break
    }
    //dialog.showMessageBox(win, {"title" : "CIAO", "message" : JSON.stringify(msg)})
  })

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL('http://localhost:3000/index.html');

    if (isDev)
      win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

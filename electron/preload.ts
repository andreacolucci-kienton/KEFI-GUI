const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendCanRqst: (...args : any[]) => ipcRenderer.send('send-can-rqst', ...args),
    recvBoard_A_Status: (callback : (event : any, arg0 : number[]) => void) => ipcRenderer.on('board-a-status', callback)
})

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendCanRqst: (...args : any[]) => ipcRenderer.send('send-can-rqst', ...args),
    recvBoard_A_Status: (callback : (event : any, arg0 : number[]) => void) => ipcRenderer.on('board-a-status', callback),
    recvBoard_B_Status: (callback : (event : any, arg0 : number[]) => void) => ipcRenderer.on('board-b-status', callback),
    recvPotential_Selection_Status: (callback : (event : any, arg0 : number[]) => void) => ipcRenderer.on('potential-selection', callback),
    recvPower_Faults_A_Status : (callback : (event : any, arg0 : number[]) => void) => ipcRenderer.on('power-faults-a', callback),
    recvPower_Faults_B_Status : (callback : (event : any, arg0 : number[]) => void) => ipcRenderer.on('power-faults-b', callback),
    recvSignal_Faults_A_Status : (callback : (event : any, arg0 : number[]) => void) => ipcRenderer.on('signal-faults-a', callback),
    recvSignal_Faults_B_Status : (callback : (event : any, arg0 : number[]) => void) => ipcRenderer.on('signal-faults-b', callback),
})

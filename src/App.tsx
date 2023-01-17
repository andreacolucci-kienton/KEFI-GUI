import './App.css';

import { Component } from 'react';

import ControlStatusBar from "./ControlStatusBar"
import SignalGrid from './SignalGrid';

import { Potential_SelectionType, Potential_Selection_StatusType, Faults_RequestType, Faults_StatusType } from './AppTypes';
import { Buffer } from 'buffer';
import { Bit } from './AppTypes';

interface AppState {
  faultRequests : Faults_RequestType[]
  faultStatus   : Faults_StatusType[]
  potentialSelectionRequest : Potential_SelectionType
  potentialSelectionStatus : Potential_Selection_StatusType
  boardAStatus : boolean
  boardBStatus : boolean
  resetRequest : boolean
}

class App extends Component<{}, AppState> {

  boardAStatusRecv : boolean
  boardBStatusRecv : boolean

  constructor(props : {}) {
    super(props)

    this.boardAStatusRecv = false
    this.boardBStatusRecv = false

    this.state = {
      faultRequests : Array(92).fill({}).map(() => ({OpenLoad_CHxx_Req : 0, ShortCircuit_CHxx_Req : 0})),
      faultStatus   : Array(92).fill({}).map(() => ({OpenLoad_CHxx : 0,     ShortCircuit_CHxx : 0})),
      potentialSelectionRequest : {Enable_Short2Pot_Request : 0, Selection_Vbat_GND_Request : 0},
      potentialSelectionStatus : {Enable_Short_Status : 0, Select_Vbat_GND_Status : 0},
      boardAStatus : false,
      boardBStatus : false,
      resetRequest : false,
    }
  }
  
  componentDidMount() {
    window.electronAPI.recvBoard_A_Status((_evt, _data) => {this.boardAStatusRecv = true})
    window.electronAPI.recvBoard_B_Status((_evt, _data) => {this.boardBStatusRecv = true})
    window.electronAPI.recvPotential_Selection_Status((_evt, data) => {
      this.setState({potentialSelectionStatus : {Enable_Short_Status : (data[0] & 0x1) as Bit, Select_Vbat_GND_Status : data[0] >= 2 ? 1 : 0}})
    })
    window.electronAPI.recvPower_Faults_A_Status((_evt, data) => {
      let newFaultStatus = [...this.state.faultStatus]
      this.unpackPowerFault(60, data, newFaultStatus)
      this.setState({faultStatus : newFaultStatus})

    })
    window.electronAPI.recvPower_Faults_B_Status((_evt, data) => {
      let newFaultStatus = [...this.state.faultStatus]
      this.unpackPowerFault(76, data, newFaultStatus)
      this.setState({faultStatus : newFaultStatus})
    })
    window.electronAPI.recvSignal_Faults_A_Status((_evt, data) => {
      let newFaultStatus = [...this.state.faultStatus]
      this.unpackSignalFault(0, data, newFaultStatus)
      this.setState({faultStatus : newFaultStatus})
    })
    window.electronAPI.recvSignal_Faults_B_Status((_evt, data) => {
      let newFaultStatus = [...this.state.faultStatus]
      this.unpackSignalFault(30, data, newFaultStatus)
      this.setState({faultStatus : newFaultStatus})
    })

    setInterval(() => {
      if (this.boardAStatusRecv)
        this.setState({boardAStatus : true})
      else
        this.setState({boardAStatus : false})
      this.boardAStatusRecv = false

      if (this.boardBStatusRecv)
        this.setState({boardBStatus : true})
      else
        this.setState({boardBStatus : false})
      this.boardBStatusRecv = false

    }, 1500)
  }
  
  sendCanRqst() {
    let Potential_Selection_buf : number[] = [
      this.state.potentialSelectionRequest.Enable_Short2Pot_Request + 2 * this.state.potentialSelectionRequest.Selection_Vbat_GND_Request,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]

    let Signals_Faults_A_buf : number[] = this.packSignalFault(0)

    let Signals_Faults_B_buf : number[] = this.packSignalFault(30)

    let Power_Faults_A_buf : number[] = this.packPowerFault(60)

    Power_Faults_A_buf = Power_Faults_A_buf.concat(Array(4).fill(0))
    let Power_Faults_B_buf : number[] = this.packPowerFault(76)

    Power_Faults_B_buf = Power_Faults_B_buf.concat(Array(4).fill(0))

    window.electronAPI.sendCanRqst(
      {
        id : 0x7F1,
        ext : false,
        buf : Buffer.from(Potential_Selection_buf)
      },
      {
        id : 0x7F3,
        ext : false,
        buf : Buffer.from(Power_Faults_A_buf)
      },
      {
        id : 0x7F5,
        ext : false,
        buf : Buffer.from(Power_Faults_B_buf)
      },
      {
        id : 0x7F2,
        ext : false,
        buf : Buffer.from(Signals_Faults_A_buf)
      },
      {
        id : 0x7F4,
        ext : false,
        buf : Buffer.from(Signals_Faults_B_buf)
      },
    )
  }

  packSignalFault(strtChannel : number) : number[] {
    let retBuf = []
    let byte = 0

    let strtChannel_OpenLoad : number = strtChannel
    let strtChannel_ShortCircuit : number = strtChannel

    for (let j = 0; j < 8; j++) {
      if (j == 0 || j == 1 || j == 4 || j == 5) {
        for (let i = 0; i < 8; i++) {
          byte += (2**i) * this.state.faultRequests[i + strtChannel_OpenLoad].OpenLoad_CHxx_Req
        }
        retBuf.push(byte)
        byte = 0
        strtChannel_OpenLoad += 8
      } else {
        for (let i = 0; i < 7; i++) {
          byte += (2**i) * this.state.faultRequests[i + strtChannel_ShortCircuit].ShortCircuit_CHxx_Req
        }
        retBuf.push(byte)
        byte = 0
        strtChannel_ShortCircuit += 7
      }
    }

    return retBuf
  }

  unpackSignalFault(strtChannel : number, msgBuffer : number[], recvFaultStatus : Faults_StatusType[]) {
    let strtChannel_OpenLoad : number = strtChannel
    let strtChannel_ShortCircuit : number = strtChannel

    for (let j = 0; j < 8; j++) {
      if (j == 0 || j == 1 || j == 4 || j == 5) {
        for (let i = 0; i < 8; i++) {
          recvFaultStatus[i + strtChannel_OpenLoad].OpenLoad_CHxx = ((msgBuffer[j] >> i) & 0x1) as Bit
        }
        strtChannel_OpenLoad += 8
      }
      else {
        for (let i = 0; i < 7; i++) {
          recvFaultStatus[i + strtChannel_ShortCircuit].ShortCircuit_CHxx = ((msgBuffer[j] >> i) & 0x1) as Bit
        }
        strtChannel_ShortCircuit += 7
      }
    }
  }

  packPowerFault(strtChannel : number) : number[] {
    let retBuf = []
    let byte = 0

    let strtChannel_OpenLoad : number = strtChannel
    let strtChannel_ShortCircuit : number = strtChannel

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 8; i++) {
        if (j == 0 || j == 2) {
          byte += (2**i) * this.state.faultRequests[i + strtChannel_OpenLoad].OpenLoad_CHxx_Req
        } else {
          byte += (2**i) * this.state.faultRequests[i + strtChannel_ShortCircuit].ShortCircuit_CHxx_Req
        }
      }
      retBuf.push(byte)
      byte = 0
      if (j == 0 || j == 2) {
        strtChannel_OpenLoad += 8
      } else {
        strtChannel_ShortCircuit += 8
      }
    }

    return retBuf
  }

  unpackPowerFault(strtChannel : number, msgBuffer : number[], recvFaultStatus : Faults_StatusType[]) {
    let strtChannel_OpenLoad : number = strtChannel
    let strtChannel_ShortCircuit : number = strtChannel

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 8; i++) {
        if (j == 0 || j == 2) {
          recvFaultStatus[i + strtChannel_OpenLoad].OpenLoad_CHxx = ((msgBuffer[j] >> i) & 0x1) as Bit
        } else {
          recvFaultStatus[i + strtChannel_ShortCircuit].ShortCircuit_CHxx = ((msgBuffer[j] >> i) & 0x1) as Bit
        }
      }
      if (j == 0 || j == 2) {
        strtChannel_OpenLoad += 8
      } else {
        strtChannel_ShortCircuit += 8
      }
    }
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<AppState>, snapshot?: any): void {
    if (this.state.resetRequest) {
      this.sendCanRqst()
      this.setState({resetRequest : false})
    }
  }
 
  render() {
    return (
      <div className="App">
        <ControlStatusBar
          A={this.state.boardAStatus}
          B={this.state.boardBStatus}
          potSec={this.state.potentialSelectionRequest} 
          setPotSec={(n_potSel) => {this.setState({potentialSelectionRequest : n_potSel})}} 
          potStatus={this.state.potentialSelectionStatus} 
          setFaultReq={(n_faultReq) => {this.setState({faultRequests : n_faultReq})}}
          sendCanRqst={() => {this.sendCanRqst()}}
          sendResetRqst={() => {this.setState({resetRequest : true})}}></ControlStatusBar>

        <SignalGrid 
          faultReq={this.state.faultRequests} 
          setFaultReq={(n_faultReq) => {this.setState({faultRequests : n_faultReq})}} 
          faultStatus={this.state.faultStatus} 
          n_channels={92}></SignalGrid>
      </div>
    );
  }
}

export default App;

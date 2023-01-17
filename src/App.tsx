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
}

class App extends Component<{}, AppState> {

  constructor(props : {}) {
    super(props)

    this.state = {
      faultRequests : Array(92).fill({OpenLoad_CHxx_Req : 0, ShortCircuit_CHxx_Req : 0} as Faults_RequestType),
      faultStatus   : Array(92).fill({OpenLoad_CHxx : 0,     ShortCircuit_CHxx : 0} as Faults_StatusType),
      potentialSelectionRequest : {Enable_Short2Pot_Request : 0, Selection_Vbat_GND_Request : 0},
      potentialSelectionStatus : {Enable_Short_Status : 0, Select_Vbat_GND_Status : 0}
    }

    window.electronAPI.recvBoard_A_Status((event, value) => {console.log("Recv msg", value)})
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

    console.log("End startchannel ", strtChannel)

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

    console.log("End startchannel ", strtChannel)

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
 
  render() {
    return (
      <div className="App">
        <ControlStatusBar 
          potSec={this.state.potentialSelectionRequest} 
          setPotSec={(n_potSel) => {this.setState({potentialSelectionRequest : n_potSel})}} 
          potStatus={this.state.potentialSelectionStatus} 
          setFaultReq={(n_faultReq) => {this.setState({faultRequests : n_faultReq})}}
          sendCanRqst={() => {this.sendCanRqst()}}></ControlStatusBar>

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

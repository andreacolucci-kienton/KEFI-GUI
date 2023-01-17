import React from 'react';
import "./SignalGrid.css"
import "./SignalChannel.css"
import { Color } from './Color';
import FaultCategory from './FaultCategory';

import { Faults_RequestType, Faults_StatusType } from './AppTypes';


interface SignalChannelInterface {
  channelNumber : number
  backGroundColor : Color
  faultReq : Faults_RequestType
  faultStatus : Faults_StatusType
  setFaultReq : (arg0 : Faults_RequestType) => void
}

class SignalChannel extends React.Component<SignalChannelInterface, {}> {
    constructor(props : SignalChannelInterface) {
      super(props);
    }
  
    render() {
      return (
        <div className='signal-channel-container' style={{backgroundColor : this.props.backGroundColor}}>
            <div className='signal-channel-title'>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div style={{flex: 1, height: '1px', backgroundColor: 'black'}} />

                <div>
                    <p style={{width: '', textAlign: 'center'}}><b> CH {this.props.channelNumber}- Signal</b></p>
                </div>

                <div style={{flex: 7, height: '1px', backgroundColor: 'black'}} />
                </div>
            </div>
            <div className="fault-box">
                <FaultCategory 
                    faultName='OpenLoad' 
                    checked={this.props.faultReq.OpenLoad_CHxx_Req == 1} 
                    faultReceived={this.props.faultStatus.OpenLoad_CHxx == 1} 
                    setFaultReq={(openLoad : boolean) => {
                        let nFault_Req : Faults_RequestType = {...this.props.faultReq}
                        nFault_Req.OpenLoad_CHxx_Req = openLoad ? 1 : 0
                        this.props.setFaultReq(nFault_Req)
                        }}></FaultCategory>
            </div>
            <div className="fault-box">
                <FaultCategory 
                    faultName='ShortCircuit' 
                    checked={this.props.faultReq.ShortCircuit_CHxx_Req == 1} 
                    faultReceived={this.props.faultStatus.ShortCircuit_CHxx == 1}
                    setFaultReq={(shortCircuit : boolean) => {
                        let nFault_Req : Faults_RequestType = {...this.props.faultReq}
                        nFault_Req.ShortCircuit_CHxx_Req = shortCircuit ? 1 : 0
                        this.props.setFaultReq(nFault_Req)
                        }}></FaultCategory>
            </div>
        </div>
      );
    }
  }

export default SignalChannel
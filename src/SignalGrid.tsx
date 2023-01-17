import React from 'react';
import "./SignalGrid.css"
import Logo from './Logo.png';
import SignalChannel from './SignalChannel';

import { Faults_RequestType, Faults_StatusType } from './AppTypes';

interface SignalGridInterface {
  n_channels : number
  faultReq : Faults_RequestType[]
  faultStatus : Faults_StatusType[]
  setFaultReq : (arg0 : Faults_RequestType[]) => void
}

class SignalGrid extends React.Component<SignalGridInterface, {}> {
    constructor(props : SignalGridInterface) {
      super(props);
    }
  
    render() {
      return (
        <div className='signal-grid'>
            {
              [...Array(this.props.n_channels)].map(
                  (x, i) => {
                    return (<SignalChannel 
                      key={i + 1} 
                      channelNumber={i + 1} 
                      backGroundColor={ i + 1 <= 60 ? "#ffffff" : "#fac08f"} 
                      faultReq={this.props.faultReq[i]} 
                      faultStatus={this.props.faultStatus[i]}
                      setFaultReq={(faultReq : Faults_RequestType) => {

                        let nFaultReq : Faults_RequestType[] = this.props.faultReq.slice()
                        nFaultReq[i] = faultReq
                        this.props.setFaultReq(nFaultReq)
                      }}
                      ></SignalChannel>)
                  }
                )
            }
            <div className="grid-logo">
              <img src={Logo} width="80%" alt=""></img>
            </div>
        </div>
      );
    }
  }

export default SignalGrid
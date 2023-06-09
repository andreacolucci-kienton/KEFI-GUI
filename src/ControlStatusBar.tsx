import React from 'react';
import "./ControlStatusBar.css"

import DoubleCheckboxContainer from './DoubleCheckboxContainer';
import ControlButtons from './ControlButton';
import StatusLight from './StatusLight';

import { Potential_SelectionType, Potential_Selection_StatusType, Faults_RequestType } from './AppTypes';

interface ControlStatusBarProps {
  A : boolean
  B : boolean
  potSec : Potential_SelectionType
  setPotSec : (arg0 : Potential_SelectionType) => void
  potStatus : Potential_Selection_StatusType
  setFaultReq : (arg0 : Faults_RequestType[]) => void
  sendCanRqst : () => void
  sendResetRqst : () => void
}

class ControlStatusBar extends React.Component<ControlStatusBarProps, {}> {
    constructor({A, B, potSec, setPotSec, potStatus, setFaultReq, sendCanRqst, sendResetRqst} : ControlStatusBarProps) {
      super({A, B, potSec, setPotSec, potStatus, setFaultReq, sendCanRqst, sendResetRqst});
    }
    
    render() {
      
      return (
        <div className='control-status-bar'>
            <DoubleCheckboxContainer 
              title="Potential Selection" 
              leftOption="VBATT"
              rightOption="GND"
              rightCheck={this.props.potSec.Selection_Vbat_GND_Request === 0}
              rightStatus={this.props.potStatus.Select_Vbat_GND_Status === 0}
              leftStatus={this.props.potStatus.Select_Vbat_GND_Status === 1}
              switchCheck={(nRightCheck : boolean) => {
                this.props.setPotSec({
                  Selection_Vbat_GND_Request : nRightCheck ? 0 : 1,
                  Enable_Short2Pot_Request : this.props.potSec.Enable_Short2Pot_Request
                })
              }}
              active={this.props.potSec.Enable_Short2Pot_Request === 0 ? false : true}></DoubleCheckboxContainer>
            <DoubleCheckboxContainer 
              title="Short typology" 
              leftOption="SHORT PIN TO PIN"
              rightOption="SHORT TO POTENTIAL" 
              rightCheck={this.props.potSec.Enable_Short2Pot_Request === 1}
              rightStatus={this.props.potStatus.Enable_Short_Status === 1}
              leftStatus={this.props.potStatus.Enable_Short_Status === 0}
              switchCheck={(nRightCheck : boolean) => {
                this.props.setPotSec({
                  Selection_Vbat_GND_Request : this.props.potSec.Selection_Vbat_GND_Request,
                  Enable_Short2Pot_Request : nRightCheck ? 1 : 0
                })
              }}
              active={true}></DoubleCheckboxContainer>
            <div style={{flex: 1}}></div>
            <div className="control-buttons-container">
              <ControlButtons name="RESET" color="#98fb98" hoverColor="#53f553" onClick={() => {
                this.props.setPotSec({
                  Selection_Vbat_GND_Request : 0,
                  Enable_Short2Pot_Request : 0
                })
                this.props.setFaultReq(Array(92).fill({OpenLoad_CHxx_Req : 0, ShortCircuit_CHxx_Req : 0} as Faults_RequestType))
                this.props.sendResetRqst()
              }}></ControlButtons>
              <ControlButtons name="KICKOUT" color="#dc143c" hoverColor="#d9022d" onClick={() => {this.props.sendCanRqst()}}></ControlButtons>
            </div>
            <div style={{flex: 2}}></div>
            <StatusLight A={this.props.A} B={this.props.B}></StatusLight>
            <div style={{flex: 1}}></div>
        </div>
      );
    }
  }

export default ControlStatusBar
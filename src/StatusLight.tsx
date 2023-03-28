import React from 'react';
import "./StatusLight.css"

import Led from './Led';

interface StatusLightInterface {
  A : boolean
  B : boolean
}

class StatusLight extends React.Component<StatusLightInterface, {}> {
    constructor(props : StatusLightInterface) {
      super(props);
    }
  
    render() {
      return (
        <div className='status-light-container'>
            <div className='status-light'>
                <Led ledOn = {this.props.A} blink = {true} size = "big" ledType = "square"></Led>
                Status_A
            </div>
            <div className='status-light'>
                <Led ledOn = {this.props.B} blink = {true} size = "big" ledType = "square"></Led>
                Status_B
            </div>
        </div>
      );
    }
  }

export default StatusLight
import React from 'react';
import "./StatusLight.css"

import Led from './Led';

class StatusLight extends React.Component {
    constructor(props : any) {
      super(props);
    }
  
    render() {
      return (
        <div className='status-light-container'>
            <div className='status-light'>
                <Led ledOn = {false} size = "big" ledType = "square"></Led>
                Status_A
            </div>
            <div className='status-light'>
                <Led ledOn = {false} size = "big" ledType = "square"></Led>
                Status_B
            </div>
        </div>
      );
    }
  }

export default StatusLight
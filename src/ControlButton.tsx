import React from 'react';
import './ControlButton.css';

import ControlButtonInterface from './ControlButtonInterface';

class ControlButtons extends React.Component<ControlButtonInterface, {}> {
    constructor(props : ControlButtonInterface) {
      super(props);
    }
  
    render() {
      return (
        <button className='control-button' style={{backgroundColor : this.props.color}} onClick={this.props.onClick}>
          <b>{this.props.name}</b>
        </button>
      );
    }
  }

export default ControlButtons
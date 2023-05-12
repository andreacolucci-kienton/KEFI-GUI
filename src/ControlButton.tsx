import React from 'react';
import './ControlButton.css';

import ControlButtonInterface from './ControlButtonInterface';

class ControlButtons extends React.Component<ControlButtonInterface, {hover : boolean}> {
    constructor(props : ControlButtonInterface) {
      super(props);

      this.state = {
        hover : false
      }
    }

    render() {

      console.log(this.state.hover)

      return (
        <button className='control-button' style={{backgroundColor : this.state.hover ? this.props.hoverColor : this.props.color}} onClick={() =>this.props.onClick} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
          <b>{this.props.name}</b>
        </button>
      );
    }
  }

export default ControlButtons
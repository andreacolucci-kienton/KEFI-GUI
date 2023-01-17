import React from 'react';
import "./DoubleCheckboxContainer.css"
import DoubleCheck from './DoubleCheckInterface';
import Led from './Led';

import { CSSProperties } from 'react';

class DoubleCheckboxContainer extends React.Component<DoubleCheck, {}> {
    constructor(props : DoubleCheck) {
      super(props);
    }

  
    render() {
      let buttonColor : CSSProperties = {}
      
      if (this.props.active)
        buttonColor.backgroundColor = "#8fbc8b"
      else
        buttonColor.backgroundColor = "grey"

      return (
        <div className='double-checkbox-container'>
            <div className='double-checkbox' style={buttonColor}>
                <div className='checkbox-title'>
                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div style={{flex: 1, height: '1px', backgroundColor: 'white'}} />

                    <div>
                      <p style={{width: 'auto', textAlign: 'center'}}><b> {this.props.title}</b></p>
                    </div>

                    <div style={{flex: 7, height: '1px', backgroundColor: 'white'}} />
                  </div>
                </div>
                <div className="checkbox-container">
                    <div className="checkbox-class"><input type="checkbox" id="left-check" name="left-check" checked={!this.props.rightCheck} disabled={!this.props.active} onChange={() => {this.props.switchCheck(!this.props.rightCheck)}}/> {this.props.leftOption} </div>
                    <Led ledOn = {this.props.leftStatus} size = "big" ledType = "square"></Led>
                    <div style={{flex: 1}}></div>
                    <div className="checkbox-class"><input type="checkbox" id="right-check" name="right-check" checked={this.props.rightCheck} disabled={!this.props.active} onChange={() => {this.props.switchCheck(!this.props.rightCheck)}}/> {this.props.rightOption} </div>
                    <Led ledOn = {this.props.rightStatus}  size = "big" ledType = "square"></Led>
                </div>
            </div>
        </div>
      );
    }
  }

export default DoubleCheckboxContainer
import { CSSProperties } from "react";
import "./Led.css"

interface ledState {
    ledOn : boolean
    size  : "small" | "big"
    ledType : "circular" | "square" 
}

export default function Led({ledOn, size, ledType} : ledState) {

    let ledStyle : CSSProperties = {}
    
    if (ledType === "square") {
        if (!ledOn)
            ledStyle.background = "radial-gradient(circle at top, #919191, #2b2b2b)"
        else
            ledStyle.background = "radial-gradient(circle at top, #93ffc9, #29e284)"
    } else {
        if (!ledOn)
            ledStyle.background = "radial-gradient(circle at top, #93ffc9, #29e284)"
        else
            ledStyle.background = "radial-gradient(circle at top, #e44848, #ff9494)"
        ledStyle.borderRadius = "30px"
    }

    if (size === "small") {
        ledStyle.width = "8px"
        ledStyle.margin = "2px"
    }
    else {
        ledStyle.width = "18px"
        ledStyle.margin = "4px"
    }

    return (
        <div className="led" style={ledStyle}></div>
    );
}
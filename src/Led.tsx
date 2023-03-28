import { CSSProperties, useCallback, useEffect, useRef } from "react";
import "./Led.css"

interface ledState {
    ledOn : boolean
    blink? : boolean
    size  : "small" | "big"
    ledType : "circular" | "square" 
}

export default function Led({ledOn, blink = false, size, ledType} : ledState) {

    let ledStyle : CSSProperties = {}
    let timerId    = useRef(0)
    let blinkState = useRef(true) 
    let ledRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        timerId.current = window.setInterval(() => {
            if (ledOn && blink) {
                if (blinkState.current) {
                    if (ledRef.current !== null)
                        ledRef.current.style.background = "radial-gradient(circle at top, #919191, #2b2b2b)"
                } else {
                    if (ledRef.current !== null)
                        ledRef.current.style.background = "radial-gradient(circle at top, #93ffc9, #29e284)"
                }
                blinkState.current = !blinkState.current
            }
        }, 500)

        return () => {
            window.clearInterval(timerId.current)
        }
    }, [ledOn, blink])

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
        ledStyle.width = "11px"
        ledStyle.margin = "2px"
    }
    else {
        ledStyle.width = "18px"
        ledStyle.margin = "4px"
    }

    return (
        <div className="led" style={ledStyle} ref={ledRef}></div>
    );
}
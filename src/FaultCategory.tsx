import Led from "./Led";
import "./FaultCategory.css"
 
interface FaultType {
    faultName : string
    checked : boolean
    faultReceived : boolean
    setFaultReq : (arg0 : boolean) => void
}

export default function FaultCategory({faultName, checked, faultReceived, setFaultReq} : FaultType) {

    return (
        <div className="fault-container">
            <Led ledOn = {checked} size = "small" ledType = "circular"></Led>
            <div className="selection-container">
                <input type="checkbox" checked={checked} onChange={() => {setFaultReq(!checked)}}></input>
                {faultName}
            </div>
            <Led ledOn = {faultReceived} size = "small" ledType = "square"></Led>
        </div>
    );
}
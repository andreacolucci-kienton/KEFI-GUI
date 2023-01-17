import CanMsg from "./CanMsgInterface"
import { Buffer } from "buffer"

export interface IElectronAPI {
    sendCanRqst: (
                Potential_Selection     : CanMsg, 
                Power_Faults_A_Request  : CanMsg,
                Power_Faults_B_Request  : CanMsg,
                Signal_Faults_A_Request : CanMsg,
                Signal_Faults_B_Request : CanMsg
            ) => void

    recvBoard_A_Status : (callback : (evt : any, Board_A_Status : number[]) => void) => void
    recvBoard_B_Status : (Board_B_Status : number[]) => void 
    recvPotential_Selection_Status : (Potential_Selection_Status : number[]) => void 
    recvPower_Faults_A_Status : (Power_Faults_A_Status : number[]) => void 
    recvPower_Faults_B_Status : (Power_Faults_B_Status : number[]) => void 
    recvSignal_Faults_A_Status : (Signal_Faults_A_Status : number[]) => void 
    recvSignal_Faults_B_Status : (Signal_Faults_B_Status : number[]) => void 
  }
  
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
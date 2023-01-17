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
    recvBoard_B_Status : (callback : (evt : any, Board_A_Status : number[]) => void) => void
    recvPotential_Selection_Status : (callback : (evt : any, Potential_Selection_Status : number[]) => void) => void
    recvPower_Faults_A_Status : (callback : (evt : any, Power_Faults_A_Status : number[]) => void) => void
    recvPower_Faults_B_Status : (callback : (evt : any, Power_Faults_B_Status : number[]) => void) => void
    recvSignal_Faults_A_Status : (callback : (evt : any, Signal_Faults_A_Status : number[]) => void) => void
    recvSignal_Faults_B_Status : (callback : (evt : any, Signal_Faults_B_Status : number[]) => void) => void
  }
  
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
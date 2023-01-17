export type Bit = 1 | 0

export type Potential_SelectionType = {
  Enable_Short2Pot_Request   : Bit
  Selection_Vbat_GND_Request : Bit
}

export type Faults_RequestType = {
  OpenLoad_CHxx_Req     : Bit
  ShortCircuit_CHxx_Req : Bit
}

export type Potential_Selection_StatusType = {
  Enable_Short_Status    : Bit
  Select_Vbat_GND_Status : Bit
}

export type Faults_StatusType = {
  OpenLoad_CHxx    : Bit
  ShortCircuit_CHxx: Bit
}
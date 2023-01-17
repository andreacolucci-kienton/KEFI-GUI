export default interface DoubleCheck{
    title : string
    leftOption : string
    rightOption : string
    rightCheck : boolean
    rightStatus : boolean
    leftStatus : boolean
    active : boolean
    switchCheck : (newRightCheck : boolean) => void
  }
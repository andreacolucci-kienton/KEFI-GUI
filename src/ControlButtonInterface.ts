import { Color } from "./Color"

export default interface ControlButtonInterface {
    name       : string
    color      : Color
    hoverColor : Color
    onClick    : () => void
}
import { Buffer } from "buffer"

export default interface CanMsg {
    id : number,
    ext : false,
    buf : Buffer
}
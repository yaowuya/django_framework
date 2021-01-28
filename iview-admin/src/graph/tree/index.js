import position from './position'
import handler from './handler-data'

export default {
  position(dom) {
    return new position.Position(dom)
  },
  handler(data, dom) {
    return new handler.HandlerData(data, dom)
  }
}

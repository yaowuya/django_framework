import classicCanvas from './classic-canvas'
import nodesModify from './nodes-modify'

const registerNodes = () => {
  const customNodes = [classicCanvas]
  customNodes.forEach(cus => {
    cus.registerNodes()
  })
}
export default {
  registerNodes,
  nodesModify
}


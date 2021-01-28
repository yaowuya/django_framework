import request from '@/utils/request'
import { parseUrl } from '@/utils/util'

export default {
  // 展示模板
  getSetList: function(params) {
    return request.get(parseUrl('topo/get_set_list'), { params: params })
  },
  initCMDBData: function(params) {
    return request.post(parseUrl('topo/init_cmdb_data'), params)
  },
  getTopologyData: function(params) {
    return request.get(parseUrl('topo/get_topology_data'), { params: params })
  },
  getInstDetailInfo: function(params) {
    return request.get(parseUrl('topo/get_inst_detail_info'), { params: params })
  }
}

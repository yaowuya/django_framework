import request from '@/utils/request'
import { parseUrl } from '@/utils/util'

export default {
  getStatusData: function(params) {
    return request.get(parseUrl('status/get_status_data'), { params: params })
  }
}

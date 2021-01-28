import request from '@/utils/request'
import { parseUrl } from '@/utils/util'

export default {
  exportPdf: function(params) {
    return request.post(parseUrl('report/export_pdf'), params)
  }
}

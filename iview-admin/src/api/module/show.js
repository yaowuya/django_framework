import request from '@/utils/request'
import { parseUrl } from '@/utils/util'

export default {
  // 展示模板
  getAllModel: function(params) {
    return request.get(parseUrl('show/get_all_model'), { params: params })
  },
  getBusinessList: function(params) {
    return request.get(parseUrl('show/get_business_list'), { params: params })
  },
  addModel: function(params) {
    return request.post(parseUrl('show/add_model'), params)
  },
  editModel: function(params) {
    return request.put(parseUrl('show/edit_model'), params)
  },
  deleteModel: function(params) {
    return request.delete(parseUrl('show/delete_model'), { params: params })
  },
  setDefaultModel: function(params) {
    return request.post(parseUrl('show/set_default_model'), params)
  },
  // 异常管理
  getException: function(params) {
    return request.get(parseUrl('show/get_exception'), { params: params })
  },
  getExceptionByInst: function(params) {
    return request.get(parseUrl('show/get_exception_by_inst'), { params: params })
  },
  addException: function(params) {
    return request.post(parseUrl('show/test_add_exception'), params)
  },
  closeException: function(params) {
    return request.post(parseUrl('show/close_exception'), params)
  },
  ignoreException: function(params) {
    return request.post(parseUrl('show/ignore_exception'), params)
  },

  // 忽略规则
  getRules: function(params) {
    return request.get(parseUrl('show/get_all_rules'), { params: params })
  },
  cancelIgnore: function(params) {
    return request.post(parseUrl('show/cancel_ignore'), params)
  }
}

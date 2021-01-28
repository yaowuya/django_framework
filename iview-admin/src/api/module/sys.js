import request from '@/utils/request'
import { parseUrl } from '@/utils/util'

export default {
  getSysInfo: function(params) {
    // return request.get(parseUrl('sys/get_sys_info'), { params: params })
    return {
      result: true,
      data: {
        roles: ['admin'], username: 'admin', logout_url: ''
      }
    }
  },
  getAllUserList: function(params) {
    return request.get(parseUrl('sys/get_all_user_list'), { params: params })
  },
  getUserList: function(params) {
    return request.get(parseUrl('sys/get_user_list'), { params: params })
  },
  getAllLocalUser: function(params) {
    return request.get(parseUrl('sys/get_all_local_user'), { params: params })
  },
  addUserList: function(params) {
    return request.post(parseUrl('sys/add_user_list'), params)
  },
  deleteUserById: function(params) {
    return request.delete(parseUrl('sys/delete_user_by_id'), { params: params })
  },
  getGroup: function(params) {
    return request.get(parseUrl('sys/get_group'), { params: params })
  },
  getAllGroup: function(params) {
    return request.get(parseUrl('sys/get_all_group'), { params: params })
  },
  addGroup: function(params) {
    return request.post(parseUrl('sys/add_group'), params)
  },
  editGroup: function(params) {
    return request.put(parseUrl('sys/edit_group'), params)
  },
  deleteGroup: function(params) {
    return request.delete(parseUrl('sys/delete_group'), { params: params })
  },
  setDefaultLogo: function(params) {
    return request.post(parseUrl('sys/set_default_logo'), params)
  }
}

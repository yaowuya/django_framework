import axios from 'axios'

const VueEnv = process.env.NODE_ENV
const ApiUrl = VueEnv === 'production' ? window.siteUrl : ''
// create an axios instance
const service = axios.create({
  baseURL: ApiUrl, // url = base url + request url
  crossDomain: true,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 200000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    const name = window.CSRF_COOKIE_NAME || 'csrftoken'
    let cookieValue = 'NOTPROVIDED'
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
        }
      }
    }
    config.headers['X-CSRFToken'] = cookieValue
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service

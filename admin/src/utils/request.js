// import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // create an axios instance
// const service = axios.create({
//   baseURL: 'http://localhost:3000', // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service

import axios from 'axios'
// import { setParams } from './setParams'
export const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    // var data = params
    axios.get(url, {
      params,
      // baseURL: 'http://localhost:3000'
    })
      .then(response => {
        if (response.status === 200) {
          if (response.data.code !== 0) {
            MessageBox.alert(response.data.message, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                reject('err')
              }
            })
          } else {
            resolve(response.data.data)
          }
        } else {
          console.log('请求失败')
        }
      })
      .catch(error => {
        console.log('请求失败')
        reject(error)
      })
  })
}

export const post = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    var data = params
    axios.post(url,
      data,
      {
        // baseURL: 'http://localhost:3000', // 这是基础url
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // transformRequest: [function (data) {
        //   // Do whatever you want to transform the data
        //   let ret = ''
        //   for (const it in data) {
        //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        //   }
        //   ret = ret.substr(0, ret.length - 1)
        //   return ret
        // }],
        timeout: 1000
      }).then(res => {
        console.log(res)
        if (res.status === 200) {
          if (res.data.code !== 0) {
            MessageBox.alert(res.data.message, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                reject('err')
              }
            })
          } else {
            resolve(res.data.data)
          }
        } else {
          console.log('请求失败')
        }
      }).catch(err => {
        reject(err)
      })
  })
}


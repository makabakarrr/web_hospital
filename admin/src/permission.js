import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import data from '@/utils/data'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/dashboard','/subscribe/index'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      let hasRoles = store.getters.roles
      const idArr = store.getters.idList
      // const hasRoles = ['admin']
      if (hasRoles) {
        if (idArr) {
          next()
        } else {
          try {
            store.dispatch('permission/getPermission', hasRoles).then(async res => {
              const accessRoutes = await store.dispatch('permission/generateRoutes', res)
              console.log(to)
              // dynamically add accessible routes
              router.addRoutes(accessRoutes)
  
              // hack method to ensure that addRoutes is complete
              // set the replace: true, so the navigation will not leave a history record
              next({ ...to, replace: true })
            }).catch(err => {
              console.log(err)
            })
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      } else {
        hasRoles = await store.dispatch('user/getInfo')
        next({ ...to, replace: true })
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

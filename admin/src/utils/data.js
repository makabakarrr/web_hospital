  const data = {
    "route": [
      {
        "path": '/deal',
        "component": "Layout",
        "name": 'Nested',
        "meta": {
          "title": 'Nested',
          "icon": 'nested'
        },
        "children": [
          {
            "path": 'reg',
            "component": "Deal", // Parent router-view
            "name": '挂号信息处理',
            "meta": { "title": '挂号信息处理' }
          }
        ]
      },
    
      {
        "path": 'permission',
        "component": "Layout",
        "children": [
          {
            "path": 'control',
            "name": '权限控制中心',
            "component": "Permission",
            "meta": { "title": 'Permission-control', "icon": 'link' }
          }
        ]
      },
      
      {
        "path": '/changePassword',
        "component": "Layout",
        "name": 'Change',
        "meta": { "title": 'Change password', "icon": 'example' },
        "children": [
          {
            "path": 'index',
            "name": 'Index',
            "component": "ChangePassword",
            "meta": { "title": 'Change password', "icon": 'table' }
          }
        ]
      },
    
      // 404 page must be placed at the end !!!
      { "path": '*', "redirect": '/404', "hidden": true }
    ]
  }
export default data
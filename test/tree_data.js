module.exports = {
  id: 30,
  roleName: '主管',
  roleDesc: '技术负责人',
  children: [
    {
      id: 101,
      authName: '商品管理',
      path: 'goods',
      pid: 0,
      children: [
        {
          id: 104,
          authName: '商品列表',
          path: 'goods',
          pid: 101,
          children: [
            { id: 105, authName: '添加商品', path: 'goods', pid: '104,101' },
            { id: 116, authName: '商品修改', path: 'goods', pid: '104,101' },
            { id: 117, authName: '商品删除', path: 'goods', pid: '104,101' }
          ]
        },
        {
          id: 115,
          authName: '分类参数',
          path: 'params',
          pid: 101,
          children: [
            { id: 142, authName: '获取参数列表', path: 'categories', pid: '115,101' },
            { id: 143, authName: '创建商品参数', path: 'categories', pid: '115,101' }
          ]
        }
      ]
    },
    {
      id: 102,
      authName: '订单管理',
      path: 'orders',
      pid: 0,
      children: [
        {
          id: 107,
          authName: '订单列表',
          path: 'orders',
          pid: 102,
          children: [
            { id: 109, authName: '添加订单', path: 'orders', pid: '107,102' },
            { id: 154, authName: '订单更新', path: 'orders', pid: '107,102' },
            { id: 155, authName: '获取订单详情', path: 'orders', pid: '107,102' }
          ]
        }
      ]
    }
  ]
}

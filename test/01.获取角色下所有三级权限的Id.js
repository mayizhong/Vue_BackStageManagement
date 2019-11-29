const scopeRow = require('./tree_data')

// console.log(scopeRow)
// 获取 scope.row 身上的所有三级权限的Id
// 递归：1. 要有一个结束的条件 2. 在函数内，要通过适当的时机，来自己调用自己

// node 表示，要进行递归的那个节点
// keyArr 是数组，用来存放所有 三级权限的Id
function getLeafIds(node, keyArr) {
  if (!node.children) {
    keyArr.push(node.id)
  } else {
    node.children.forEach(item => {
      getLeafIds(item, keyArr)
    })
  }
}

const keys = []
getLeafIds(scopeRow, keys)
console.log(keys)

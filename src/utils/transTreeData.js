export function tranTreeData(list) {
// 声明新数组
  const listTree = []
  // 按照数组中的每一项作为id,以每一项作为自身的value树形形成一个对象结构
  const map = {}
  list.forEach(item => {
    // 判断item中的children属性存不存在
    if (!item.children) {
      item.children = []
    }
    map[item.id] = item
  })
  // 再次遍历数组
  list.forEach(item => {
    const parent = map[item.pid]
    // 如果存在则表示item不是最顶层的数据
    if (parent) {
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    } else {
      // 如果不存在,那么就是顶层的数据
      listTree.push(item)
    }
  })
  return listTree
}


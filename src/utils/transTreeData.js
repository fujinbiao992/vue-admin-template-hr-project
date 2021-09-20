
// 1.把当前频繁变动的判断条件抽离成一个函数的变量 然后在使用的时候把这个变量当前值传下来
// 保证当前的方法内的逻辑不会再发生变化

// 2.为了兼容之前已经落实到具体业务场景下的函数调用，我们把之前通用的参数null作为默认参数
export function transTreeData(list, curPid = '') {
  const treeList = []
  // 属性处理逻辑
  // 1. 以数组中每一项的id作为key,以每一项自身作为value形成一个对象结构
  const map = {}
  list.forEach(item => {
    map[item.id] = item
    if (!item.children) {
      item.children = []
    }
  })
  // console.log('形成的以id为对象', map)
  // 2. 以数组每一项中的pid去和map对象中的key做匹配  如果匹配的上就把当前数组项添加到chilren属性中
  // 如果数组的pid为null为空  则表示当前数组项就是一个最根上的节点不需要找自己的父节点
  list.forEach(item => {
    // 原因:  pid '0'  字符串  对字符串取反得到的就是false
    if (item.pid === curPid) {
      // 当前没有父节点
      treeList.push(item)
    } else {
      // 有父节点
      map[item.pid] && map[item.pid].children.push(item)
    }
  })
  // 借助了js中引用类型的存储特性  只需要遍历一遍 每一个节点找到自己的父节点之后 遍历完毕  树形结构也跟着一起生成
  // console.log('树形结构', treeList)
  return treeList
}

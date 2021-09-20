import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import menu from './modules/menu'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 组合所有的模块
  modules: {
    app,
    settings,
    user,
    menu
  },
  // 全局getters $store.getters.属性名称
  // 模块中的getters  $store.gettters.模块名称.属性
  getters
})

export default store

/**
 * 1. 大应用开发下才需要使用模块化
 * 2. state和getters 数据   $store(使用的数据少)  映射使用map(使用的数据多) + 计算属性
 * 3. mutation/actions 对数据的操作 $store(使用的数据少)  映射使用map(使用的数据多) + methods
 * 4. 全局getters经常用来做快捷访问  全局gettters state参数拿到的是聚集所有模块的state中的数据完整对象
 * 5. 原则上跨越模块互相调用mutation函数是行不通的,如果想在一个模块的aciton函数调用另外一个模块的mutation函数
 *    ctx.commit('模块名称/mutation名称',payload, {root:true})
 *
 */

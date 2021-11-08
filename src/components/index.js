import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg'
import ImgPlaceHoder from './ImgPlaceHolder'
import ScreenFull from './ScreenFull'
import Lang from './Lang'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImg', UploadImg)
    Vue.component('ImgPlaceHoder', ImgPlaceHoder)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('Lang', Lang)
  }
}

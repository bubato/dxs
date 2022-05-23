import assign from 'object-assign'
import component from './cropper.vue'

const defaultOptions = {
  componentName: 'croppa',
}

const VueCroppa = {
  install(Vue, options) {
    options = assign({}, defaultOptions, options)
    const version = Number(Vue.version.split('.')[0])
    if (version < 2) {
      throw new Error(
        `vue-croppa supports vue version 2.0 and above. You are using Vue@${version}. Please upgrade to the latest version of Vue.`
      )
    }
    const componentName = options.componentName || 'croppa'

    // registration
    Vue.component(componentName, component)
  },

  component,
}
export default VueCroppa

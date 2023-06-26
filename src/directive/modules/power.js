// 权限控制

export default {
  beforeMount(el, binding) {
    console.log('beforeMount', el, binding)
  },
  mounted(el, binding) {
    // if (!store.getters.havePermission(binding.value)) {
    //   el && el.parentNode.removeChild(el)
    // }
    console.log('beforeMount', el, binding)
  },
  beforeUpdate(el, binding) {
    console.log('beforeUpdate', el, binding)
  },
  updated(el, binding) {
    // if (!store.getters.havePermission(binding.value)) {
    //   el && el.parentNode.removeChild(el)
    // }
    console.log('updated', el, binding)
  },
  beforeUnmount(el, binding) {
    console.log('beforeUnmount', el, binding)
  },
  unmounted(el, binding) {
    console.log('unmounted', el, binding)
  },
}
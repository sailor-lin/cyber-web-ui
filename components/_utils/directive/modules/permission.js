import { permissionNodes, permissionProcessing } from '../../store/modules/permission';

export default {
  name: 'permission',
  mounted(el, binding, context) {
    permissionProcessing(el, binding.value, context.ctx.uid);
  },
  updated(el, binding, context) {
    permissionProcessing(el, binding.value, context.ctx.uid);
  },
  beforeUnmount(el, binding, context) {
    delete permissionNodes[context.ctx.uid];
  },
};

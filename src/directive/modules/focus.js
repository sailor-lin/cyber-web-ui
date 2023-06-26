// 自动聚焦
export default {
  mounted(el, binding) {
    if(!el) return;
    if(el.tagName == 'INPUT') {
      el.focus();
    } else {
      let list = el.querySelectorAll('input');
      Array.from((list || [])).some(input => {
        if(!input?.offsetParent) return false;
        else {
          input.focus();
          return true;
        }
      })
    }
  }
}
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  name: "CSwitchControl",
  props: {
    // 是否选中
    checked: {
      type: [Boolean, String, Number],
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 选中时的值
    checkedValue: {
      type: [Boolean, String, Number],
      default: true,
    },
    // 未选中时的值
    unCheckedValue: {
      type: [Boolean, String, Number],
      default: false,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const checked = ref();
    const animationFlag = ref(false);
    let timeout = undefined;

    const checkedStatus = computed(() => checked.value == props.checkedValue);

    const methods = {
      clickHandler() {
        if(props.disabled) return;
        animationFlag.value = false;
        checked.value = checkedStatus.value ? props.unCheckedValue : props.checkedValue;
        setTimeout(() => {
          animationFlag.value = true;
          timeout && clearTimeout(timeout);
          timeout = setTimeout(() => {
            animationFlag.value = false;
          }, 3000);
        });
        emit('update:checked', checked.value);
        emit('change', checked.value);
      },
    };

    watch(() => props.checked, () => {
      checked.value = props.checked;
    }, { immediate: true });

    return () => {
      return (
        <button
          class={['cyber-switch-control', { 'active': checkedStatus.value }, { 'cyber-switch-control-disabled': props.disabled }]}
          onClick={methods.clickHandler}
        >
          { slots.default?.() }
          <div class="circle"></div>
          { animationFlag.value ? <div class="switch-control-click-animating"></div> : undefined }
        </button>
      );
    };
  },
});

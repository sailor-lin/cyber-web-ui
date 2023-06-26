import { defineComponent,  reactive } from 'vue';

export default defineComponent({
  name: 'CLayoutHeader',
  props: {
    logo: String,
  },
  setup(props, { attrs, slots, emit, expose }) {

    return () => {
      function logoSlot() {
        return slots.logo
          ? slots.logo()
          : props.logo
            ? <img src={props.logo} class="cyber-layout-logo"/>
            : <span style="font-size: 24px; font-weight: 600;">Logo</span>
      }
      return (
        <div class="cyber-layout-header">
          <div class="cyber-layout-header-body">
            <div class="cyber-layout-header-left">
              { logoSlot() }
              { slots.left?.() }
            </div>
            <div class="cyber-layout-header-right">
              { slots.right?.() }
            </div>
          </div>
        </div>
      )
    }
  }
});

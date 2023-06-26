import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CTreeBody',
  props: {},
  setup(props, { attrs, slots, emit, expose }) {
    return () => {
      return (
        <div class="cyber-tree-body">
          {
            slots.header
              ? <div class="cyber-tree-body-top">
                  { slots.header?.() }
                </div>
              : undefined
          }
          <div class="cyber-tree-body-container">
            { slots?.default() }
          </div>
        </div>
      )
    }
  }
});

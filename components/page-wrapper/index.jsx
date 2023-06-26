import { defineComponent } from 'vue';

const PageWrapper = defineComponent({
  name: 'CPageWrapper',
  props: {
    padding: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    return () => {
      return (
        <div class="cyber-page-wrapper">
          {
            props.showHeader
              ? (
                  <div
                    class="cyber-page-wrapper-header"
                    style={{ padding: props.padding ? '0 20px' : '0' }}
                  >
                    { slots.header?.() }
                  </div>
                )
              : undefined
          }
          <div class="cyber-page-wrapper-content">
            { slots.default?.() }
          </div>
        </div>
      );
    }
  },
});

PageWrapper.install = (app) => {
  app.component(PageWrapper.name, PageWrapper);
};

export default PageWrapper;

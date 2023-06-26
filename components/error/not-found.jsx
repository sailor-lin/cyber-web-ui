import { defineComponent, reactive } from 'vue';
import { Result as AResult } from 'ant-design-vue';
import { generateRandomCode } from '../_utils/crypto';

export default defineComponent({
  name: 'CNotFound',
  props: {},
  setup(props, { attrs, slots, emit, expose }) {
    return () => {
      return <AResult class={[generateRandomCode()]} status="404" title="404" { ...attrs } v-slots={slots} />
    }
  }
});

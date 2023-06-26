import Cell from './Cell';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'CCellDict',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: undefined,
    },
    iconProps: {
      type: Object,
      default: () => {}
    },
    fieldNames: {
      type: Object,
      default: () => ({ label: 'label', value: 'value', icon: 'icon', tips: 'tips' }),
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const dictRecord = computed(() => {
      if (props.value !== null && typeof props.value !== "undefined") {
        if(props.options?.length) {
          let find = props.options.find(item => item.value == props.value);
          return find || {
            [props.fieldNames.label]: props.value,
          };
        } else {
          return {
            [props.fieldNames.label]: props.value + '',
          };
        }
      }
      return {
        [props.fieldNames.label]: '-',
      };
    });

    return () => {
      return (
        <Cell
          {...attrs}
          icon={dictRecord.value?.[props.fieldNames?.icon]}
          title={dictRecord.value?.[props.fieldNames?.label]}
          tips={dictRecord.value?.[props.fieldNames?.tips]}
          iconProps={{
            size: "8px",
            isSvg: true,
            ...(props.iconProps || {})
          }}
        ></Cell>
      )
    }
  },
});

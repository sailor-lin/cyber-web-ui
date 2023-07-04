import bigjs from '@/utils/bigjs';
import { reactive, defineComponent } from "vue";
import { Input as AInput } from "ant-design-vue";

const Input = {};

const InputNumber = defineComponent({
  props: {
    value: {
      type: [String, Number],
    },
    max: {
      type: Number,
      default: Infinity,
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    addonBefore: {
      type: String,
    },
    addonAfter: {
      type: String,
      default: '',
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inputType: {
      type: String,
      default: 'number',
      validator: (value) => ["number", "integer"].includes(value),
    },
  },
  setup() {

    const inputNumberState = reactive({
      value: '0',
      numberMode: computed(() => {
        return props.addonAfter || props.addonBefore ? "wrap" : "default";
      }),
    });

    return () => {
      return (
        <a-input
          class={['g-input-number', inputNumberState.numberMode]}
          v-model:value="inputNumberState.value"
          :addonBefore="addonBefore"
          :disabled="disabled"
          :inputType="inputType"
          :round="false"
          :search="false"
          :password="false"
          @blur="methods.blurHandler"
        >
          <!-- default mode -->
          <template #addonBefore v-if="inputNumberState.numberMode == 'default'">
            <span
              :class="[
                'g-input-addon-before pointer',
                { disabled: inputNumberState.value == min || disabled }
              ]"
              @click="methods.clickHandler(false)"
            >
              <g-icon icon="icon-Icon_Reduce_24"></g-icon>
            </span>
          </template>
          <template #addonAfter v-if="inputNumberState.numberMode == 'default'">
            <span
              :class="[
                'g-input-addon-after pointer',
                { disabled: inputNumberState.value == max || disabled }
              ]"
              @click="methods.clickHandler(true)"
            >
              <g-icon icon="icon-Icon_Plus_24"></g-icon>
            </span>
          </template>
          <!-- wrap mode -->
          <template #addonAfter v-else>
            <span class="flex">
              <div class="g-input-number-control">
                <div
                  :class="[
                    'g-input-number-up',
                    { disabled: inputNumberState.value == max || disabled }
                  ]"
                  @click="methods.clickHandler(true)"
                >
                  <g-icon icon="icon-a-Icon_Drop-down_161"></g-icon>
                </div>
                <div
                  :class="[
                    'g-input-number-down',
                    { disabled: inputNumberState.value == min || disabled }
                  ]"
                  @click="methods.clickHandler(false)"
                >
                  <g-icon icon="icon-a-Icon_Drop-down_161"></g-icon>
                </div>
              </div>
              <span class="g-input-addon-after" v-if="$slots.addonAfter || addonAfter">
                <slot>{{ addonAfter }}</slot>
              </span>
            </span>
          </template>
        </g-input>
      );
    };
  },
});

Input.install
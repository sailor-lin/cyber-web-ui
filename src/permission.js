import { nextTick } from 'vue';
import { dictStore } from '@/store';
import router from '@/router/index.js';
import defaultDict from '@/store/modules/defaultDict';

nextTick(() => {
  // 初始化本地字典
  const $dictStore = dictStore();
  Object.keys((defaultDict || {})).forEach(key => {
    $dictStore.update(key, defaultDict[key], { label: 'label', value: 'value' });
  });
})
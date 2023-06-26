<template>
  <component :is="detailState.component" v-bind="paramsState"></component>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import Example from './Example/index.vue';

const $useRoute = useRoute();
const $useRouter = useRouter();

const paramsState = reactive({
  cluster: '',
  namespace: '',
  kind: '',
  name: '',
})
const detailState = reactive({
  component: null,
})
const reload = inject("reload");

const methods = {
  init() {
    // 加载参数
    Object.keys($useRoute.params).forEach(key => {
      paramsState[key] = $useRoute.params[key];
    })

    // 当缺少参数时，跳转到404
    // if(!paramsState.cluster || !paramsState.namespace || !paramsState.kind || !paramsState.name) {
    //   $useRouter.replace('/404')
    // }

    // 判断当前详情页
    switch(paramsState.kind) {
      // 容器详情
      default: detailState.component = shallowRef(Example);
    }

    // 重载页面
    watch(() => $useRoute, () => {
      reload();
    }, { deep: true, })
  },
}

methods.init();
</script>

<style lang="less" scoped>
</style>

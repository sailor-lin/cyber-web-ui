<template>
  <a-upload
    class="g-upload"
    v-model:fileList="state.fileList"
    :headers="state.headers"
    name="file"
    list-type="text"
    v-bind="$attrs"
    :beforeUpload="methods.beforeUpload"
    @change="methods.onChange"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-upload>
</template>

<script setup>
import { message } from 'ant-design-vue'
import cookie from '@/utils/cookie'
// const $useStore = useStore()
const props = defineProps({
  maxSize: {
    type: String,
    default: '50'
  },
  maxCount: {
    type: Number,
    default: 10
  },
  fileList: {
    type: Array,
    default: () => []
  },
  uploadType: {
    type: String,
    default: '' // png,jpg,pdf
  }
})
const state = reactive({
  headers: {
    // Token: $useStore.state.token,
  },
  fileList: [
    // {
    //   uid: "1",
    //   name: "productTemplate.xls",
    //   type: "application/vnd.ms-excel",
    //   size: data.fileSize,
    //   status: "done",
    // },
  ]
})

const $emit = defineEmits(['update:fileList', 'success', 'delete', 'setFileTitle'])

const methods = {
  setFileTitle(obj) {
    $emit('setFileTitle', obj)
  },
  init() {
    watch(
      () => props.fileList,
      (value, oldValue) => {
        if (JSON.stringify(value) == JSON.stringify(oldValue)) return
        state.fileList = [...value]
      },
      { immediate: true, deep: true }
    )
  },
  // 上传拦截
  beforeUpload(file) {
    // 上传格式限制
    if (props.uploadType) {
      let typeReg = props.uploadType.split(',').map(item => `.${item}$`).join('|')
      if (!new RegExp(typeReg).test(file.name)) {
        message.warning(`只能上传${props.uploadType}`)
        return Promise.reject()
      }
    }
    // 上传文件大小限制
    if (file.size > props.maxSize * 1024 * 1024) {
      message.warning(`上传的文件不能大于${props.maxSize}M`)
      return Promise.reject()
    }
    // 上传个数限制
    if (state.fileList.length + 1 > props.maxCount) {
      message.error(`最多只能上传${props.maxCount}个文件`)
      return Promise.reject()
    }
    return Promise.resolve()
  },
  // 上传文件
  onChange(options) {
    const { file } = JSON.parse(JSON.stringify(options))
    if (file.status == 'done') {
      // 上传文件处理逻辑
    } else if (file.status == 'error') {
      message.warning('上传失败')
    }
  },
  delete(file) {
    console.log(file)
    let obj = {}
    state.fileList = state.fileList.filter(item => {
      if (file.uid != item.uid) {
        return true
      }
      obj = item
      return false
    })
    $emit('delete', obj)
  }
}

methods.init()
</script>

<style lang="less" scoped>
</style>

<template>
  <g-page-label title="安全组" icon="icon-rongqi">
    <template #tips>提供虚拟机内部服务向外暴露的方法和入口。</template>
  </g-page-label>

  <g-page-body>
    <template #header>
      <g-params :loading="tableState.loading" @search="methods.searchQuery()">
        <!-- id搜索 -->
        <g-input
          v-model:value="queryParams.id"
          placeholder="输入id搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 租户编码搜索 -->
        <g-input
          v-model:value="queryParams.tenantCode"
          placeholder="输入租户编码搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 项目编码搜索 -->
        <g-input
          v-model:value="queryParams.projectCode"
          placeholder="输入项目编码搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 用户id搜索 -->
        <g-input
          v-model:value="queryParams.userId"
          placeholder="输入用户id搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- uc中心统一的userId搜索 -->
        <g-input
          v-model:value="queryParams.ssoUserId"
          placeholder="输入uc中心统一的userId搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 昵称搜索 -->
        <g-input
          v-model:value="queryParams.nickname"
          placeholder="输入昵称搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 头像搜索 -->
        <g-input
          v-model:value="queryParams.icon"
          placeholder="输入头像搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 等级搜索 -->
        <g-input
          v-model:value="queryParams.level"
          placeholder="输入等级搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 区域搜索 -->
        <g-input
          v-model:value="queryParams.region"
          placeholder="输入区域搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 父代理id搜索 -->
        <g-input
          v-model:value="queryParams.parentId"
          placeholder="输入父代理id搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 最后一次登录时间搜索 -->
        <g-input
          v-model:value="queryParams.lastLoginTime"
          placeholder="输入最后一次登录时间搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 状态搜索 -->
        <g-input
          v-model:value="queryParams.status"
          placeholder="输入状态搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 创建者id搜索 -->
        <g-input
          v-model:value="queryParams.creatorId"
          placeholder="输入创建者id搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 更新者id搜索 -->
        <g-input
          v-model:value="queryParams.updatorId"
          placeholder="输入更新者id搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 版本号搜索 -->
        <g-input
          v-model:value="queryParams.version"
          placeholder="输入版本号搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- createTime搜索 -->
        <g-input
          v-model:value="queryParams.createTime"
          placeholder="输入createTime搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- updateTime搜索 -->
        <g-input
          v-model:value="queryParams.updateTime"
          placeholder="输入updateTime搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <template #right>
          <g-button type="primary" @click="methods.showModify()">创建</g-button>
        </template>
      </g-params>
    </template>

    <g-table
      ref="tableRef"
      rowKey="id"
      v-model:loading="tableState.loading"
      :columns="tableState.columns"
      :overlayMenu="tableState.overlayMenu"
    ></g-table>
  </g-page-body>

  <g-modal
    ref="modalRef"
    v-model:visible="modalState.visible"
    width="976px"
    :icon="modalState.icon"
    :title="modalState.title"
    :okText="modalState.okText"
    @ok="methods.onSubmit"
  >
    <g-form
      ref="formRef"
      name="formName"
      :model="formState"
      :rules="rules"
      autocomplete="off" layout="vertical"
    >
      <div class="grid grid-cols-2 gap-x-20px">
        <g-form-item label="id" name="id">
          <g-input v-model:value="formState.id" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="租户编码" name="tenantCode">
          <g-input v-model:value="formState.tenantCode" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="项目编码" name="projectCode">
          <g-input v-model:value="formState.projectCode" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="用户id" name="userId">
          <g-input v-model:value="formState.userId" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="uc中心统一的userId" name="ssoUserId">
          <g-input v-model:value="formState.ssoUserId" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="昵称" name="nickname">
          <g-input v-model:value="formState.nickname" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="头像" name="icon">
          <g-input v-model:value="formState.icon" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="等级" name="level">
          <g-input v-model:value="formState.level" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="区域" name="region">
          <g-input v-model:value="formState.region" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="父代理id" name="parentId">
          <g-input v-model:value="formState.parentId" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="最后一次登录时间" name="lastLoginTime">
          <g-input v-model:value="formState.lastLoginTime" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="状态" name="status">
          <g-input v-model:value="formState.status" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="创建者id" name="creatorId">
          <g-input v-model:value="formState.creatorId" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="更新者id" name="updatorId">
          <g-input v-model:value="formState.updatorId" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="版本号" name="version">
          <g-input v-model:value="formState.version" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="createTime" name="createTime">
          <g-input v-model:value="formState.createTime" placeholder="请输入"></g-input>
        </g-form-item>
        <g-form-item label="updateTime" name="updateTime">
          <g-input v-model:value="formState.updateTime" placeholder="请输入"></g-input>
        </g-form-item>
      </div>
    </g-form>
  </g-modal>
</template>

<script setup>
import axios from '@/api';
import { message } from 'ant-design-vue';
import GModal from '@/components/global/modal/g-modal.jsx';
import { changeHistoryState, initHistoryParams } from "@/utils/dispose";
const formRef = ref();
const tableRef = ref();
// 表格请求参数
const queryParams = reactive({
  ...initHistoryParams({
    id: undefined,
    tenantCode: undefined,
    projectCode: undefined,
    userId: undefined,
    ssoUserId: undefined,
    nickname: undefined,
    icon: undefined,
    level: undefined,
    region: undefined,
    parentId: undefined,
    lastLoginTime: undefined,
    status: undefined,
    creatorId: undefined,
    updatorId: undefined,
    version: undefined,
    createTime: undefined,
    updateTime: undefined,
  }),
});
// 表格信息
const tableState = reactive({
  loading: false,
  columns: [
    { title: 'id', dataIndex: "id" },
    { title: '租户编码', dataIndex: "tenantCode" },
    { title: '项目编码', dataIndex: "projectCode" },
    { title: '用户id', dataIndex: "userId" },
    { title: 'uc中心统一的userId', dataIndex: "ssoUserId" },
    { title: '昵称', dataIndex: "nickname" },
    { title: '头像', dataIndex: "icon" },
    { title: '等级', dataIndex: "level" },
    { title: '区域', dataIndex: "region" },
    { title: '父代理id', dataIndex: "parentId" },
    { title: '最后一次登录时间', dataIndex: "lastLoginTime" },
    { title: '状态', dataIndex: "status" },
    { title: '创建者id', dataIndex: "creatorId" },
    { title: '更新者id', dataIndex: "updatorId" },
    { title: '版本号', dataIndex: "version" },
    { title: 'createTime', dataIndex: "createTime" },
    { title: 'updateTime', dataIndex: "updateTime" },
  ],
  overlayMenu: [
    {
      label: "编辑",
      handler: (record) => methods.showModify(record),
    },
    {
      label: "删除",
      handler: (record) => methods.delete(record),
    },
  ],
});
// 弹窗信息
const modalState = reactive({
  visible: false,
  isCreate: true,
  icon: computed(() => modalState.isCreate ? 'icon-xinjian' : 'icon-bianji'),
  title: computed(() => modalState.isCreate ? '创建' : '编辑'),
  okText: computed(() => modalState.isCreate ? '创建' : '编辑'),
});
// 表单信息
const formState = reactive({
  id: undefined,
  tenantCode: undefined,
  projectCode: undefined,
  userId: undefined,
  ssoUserId: undefined,
  nickname: undefined,
  icon: undefined,
  level: undefined,
  region: undefined,
  parentId: undefined,
  lastLoginTime: undefined,
  status: undefined,
  creatorId: undefined,
  updatorId: undefined,
  version: undefined,
  createTime: undefined,
  updateTime: undefined,
});
// 表单校验规则
const rules = {};

const methods = {
  // 搜索表格
  async searchQuery() {
    changeHistoryState(queryParams);
    // 磁盘列表（PVC列表）
    nextTick(() => {
      unref(tableRef).searchQuery({
        url: '/agent/search',
        method: 'get',
        data: queryParams,
      });
    });
  },
  // 显示弹窗
  showModify(record) {
    modalState.visible = true;
    modalState.isCreate = !record;
    Object.keys(formState).forEach(key => {
      formState[key] = modalState.isCreate ? undefined : record[key];
    });
  },
  onSubmit() {
    return new Promise((resolve, reject) => {
      // 校验表单
      try {
        unref(formRef).validate().then(async () => {
          let res = await axios.request({
            url: '/agent',
            method: modalState.isCreate ? 'post' : 'put',
            data: formState
          });
          message.success(res.message);
          methods.searchQuery();
          resolve();
        }).catch((error) => {
          console.log('validateError', error)
          reject()
        });
      } catch (error) {
        console.log('error', error);
        reject();
      }
    })
  },
  delete(record) {
    GModal.confirm({
      title: `删除`,
      icon: 'icon-shanchu',
      content: `确定要删除吗，删除后将无法恢复！`,
      okButtonProps: {
        pattern: 'error',
      },
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          try {
            let res = await axios.request({
              url: '/agent',
              method: 'delete',
              params: {
                id: record.id,
              }
            });
            message.success(res.message);
            methods.searchQuery();
            resolve();
          } catch(error) {
            console.log('error', error);
            reject();
          }
        });
      },
    })
  },
};

methods.searchQuery();
</script>

<style lang="less" scoped>
</style>

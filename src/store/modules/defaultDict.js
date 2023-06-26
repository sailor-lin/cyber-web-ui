export default {
  // 命名空间
  ...({
    // 命名空间状态
    namespaceStatus: [
      { "label": "活跃", "value": "Active", color: 'primary' },
      { "label": "终止", "value": "Terminating", color: 'error' }
    ],
    // 命名空间类型
    namespaceType: [
      { label: "系统空间", value: '0' },
      { label: "用户空间", value: '1' }
    ],
  }),
  // 工作负载
  ...({
    // 负载运行状态
    loadStatus: [
      { label: '运行中', value: '1' },
      { label: '更新中', value: '2' },
      { label: '已停止', value: '3' },
    ],
    // 负载类型
    loadType: [
      // 无状态/部署
      { label: '部署', value: '0', name: 'DeploymentList' },
      // 有状态集群
      { label: '有状态副本集', value: '1', name: 'StatefulSetList' },
      // 守护进程集
      { label: '守护进程集', value: '2', name: 'DaemonSetList' },
    ],
  }),
  // 容器组
  ...({
    /* 容器组运行状态
        pod运行状态：通过status.phase判断
      */
    podRunningStatus: [
      { "label": "运行中", "value": "1", color: 'primary' },
      { "label": "更新中", "value": "2", color: 'warning' },
      { "label": "失败", "value": "3", color: 'error' }
      // { "label": "未知", "value": "4", color: 'grey' }
    ],
    // 容器组状态
    podGroupStatus: [
      { label: '正常', value: '1' },
      { label: '异常', value: '2' },
    ],
    /*
      pod错误原因
      pod状况 status.conditions[].type 
      */
    podConditionsType: [
      { "label": "容器组调度完成", "value": "PodScheduled" },
      { "label": "容器网络配置完成", "value": "PodHasNetwork" },
      { "label": "容器组已准备就绪", "value": "ContainersReady" },
      { "label": "所有Init容器都已完成", "value": "Initialized" },
      { "label": "可用", "value": "Ready" },
    ],
    // pod状态解析：status.phase
    // podStatus: [
    //   { "label": "更新中", "value": "Pending", "color": "warning"},
    //   { "label": "运行中", "value": "Running", "color": "primary" },
    //   { "label": "成功", "value": "Succeeded", "color": "primary" },
    //   { "label": "失败", "value": "Failed", "color": "error" },
    //   { "label": "未知", "value": "Unknown", "color": "grey" }
    // ],
  }),
  // 任务
  ...({
    // 任务类型
    taskType: [
      { label: '任务', value: '0', name: 'JobList' },
      { label: '定时任务', value: '1', name: 'CronJobList' }
    ],
    // 任务状态
    taskStatus: [
      { label: '运行中', value: '0' },
      { label: '已完成', value: '1' },
      { label: '已挂起', value: '2' },
      { label: '失败', value: '3' },
    ]
  }),
}
export default {
  // 命名空间
  'NamespaceList': {
    title: '命名空间', // 标题
    labelName: '命名空间', // 标签名
    allList: 'allNamespaces', // 集群下的列表
    manage: 'manageNamespaces', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createNamespaces',
      title: '创建Namespace', // 创建标题
      body: {
        "kind": "Namespace",
        "apiVersion": "v1",
        "metadata": {
          "name": "example",
          "labels": {
            "kubernetes.io/metadata.name": "example"
          }
        },
        "spec": {
          "finalizers": ["kubernetes"]
        }
      }
    },
    // 修改配置
    update: {
      manage: 'manageNamespaces',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // 部署/无状态集群
  'DeploymentList': {
    title: '部署', // 标题
    labelName: '无状态集', // 标签名
    list: 'batchDeployments', // 命名空间下的列表
    allList: 'allDeployments',  // 集群下的列表
    manage: 'manageDeployments', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createDeployments',
      title: '创建Deployment', // 创建标题
      body: {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
          "name": "example",
          "namespace": "cmp"
        },
        "spec": {
          "replicas": 3,
          "selector": {
            "matchLabels": {
              "app": "hello-world",
              "deployment": "hello-world"
            }
          },
          "template": {
            "metadata": {
              "labels": {
                "app": "hello-world",
                "deployment": "hello-world"
              }
            },
            "spec": {
              "containers": [{
                "image": "113.108.106.175:444/library/hello-world:latest",
                "name": "hello-world",
                "ports": [{
                  "containerPort": 8080
                }]
              }]
            }
          }
        }
      }
    },
    // 修改配置
    update: {
      manage: 'manageDeployments',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // 有状态集群
  'StatefulSetList': {
    title: '有状态副本集', // 标题
    labelName: '有状态集', // 标签名
    list: 'batchStatefulSet', // 命名空间下的列表
    allList: 'allStatefulSet', // 集群下的列表 
    manage: 'manageStatefulSet', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createStatefulSet',
      title: '创建StatefulSet', // 创建标题
      body: {
        "apiVersion": "apps/v1",
        "kind": "StatefulSet",
        "metadata": {
          "name": "example",
          "namespace": "cmp"
        },
        "spec": {
          "replicas": 3,
          "selector": {
            "matchLabels": {
              "app": "nginx",
              "statefulset": "nginx"
            }
          },
          "serviceName": "nginx",
          "template": {
            "metadata": {
              "labels": {
                "app": "nginx",
                "statefulset": "nginx"
              }
            },
            "spec": {
              "containers": [{
                "image": "113.108.106.175:444/library/nginx-slim:0.8",
                "name": "nginx",
                "ports": [{
                  "containerPort": 80,
                  "name": "web"
                }],
                "volumeMounts": [{
                  "mountPath": "/usr/share/nginx/html",
                  "name": "www"
                }]
              }],
              "terminationGracePeriodSeconds": 10
            }
          },
          "volumeClaimTemplates": [{
            "metadata": {
              "name": "www"
            },
            "spec": {
              "accessModes": ["ReadWriteOnce"],
              "resources": {
                "requests": {
                  "storage": "1Gi"
                }
              },
              "storageClassName": "my-storage-class"
            }
          }]
        }
      }
    },
    // 修改配置
    update: {
      manage: 'manageStatefulSet',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // 守护进程集
  'DaemonSetList': {
    title: '守护进程集', // 标题
    labelName: '守护进程集', // 标签名
    list: 'batchDaemonSet', // 命名空间下的列表
    allList: 'allDaemonSet', // 集群下的列表 
    manage: 'manageDaemonSet', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createDaemonSet',
      title: '创建DaemonSet', // 创建标题
      body: {
        "apiVersion": "apps/v1",
        "kind": "DaemonSet",
        "metadata": {
          "name": "example",
          "namespace": "cmp"
        },
        "spec": {
          "selector": {
            "matchLabels": {
              "app": "hello-world",
              "daemonset": "hello-world"
            }
          },
          "template": {
            "metadata": {
              "labels": {
                "app": "hello-world",
                "daemonset": "hello-world"
              }
            },
            "spec": {
              "containers": [{
                "image": "113.108.106.175:444/library/hello-world:latest",
                "name": "hello-world",
                "ports": [{
                  "containerPort": 8080
                }]
              }]
            }
          }
        }
      }
    },
    // 修改配置
    update: {
      manage: 'manageDaemonSet',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // 容器组
  'PodList': {
    title: '容器组', // 标题
    labelName: '容器组', // 标签名
    list: 'batchPod', // 命名空间下的列表
    allList: 'allPod', // 集群下的列表
    manage: 'managePod', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createPod',
      title: '创建Pod', // 创建标题
      body: {
        "apiVersion": "v1",
        "kind": "Pod",
        "metadata": {
          "name": "hello-world",
          "namespace": "cmp"
        },
        "spec": {
          "containers": [{
            "image": "113.108.106.175:444/library/hello-world:latest",
            "imagePullPolicy": "IfNotPresent",
            "name": "hello-world",
            "resources": {
              "limits": {
                "cpu": "2",
                "ephemeral-storage": "10Gi",
                "memory": "2Gi"
              },
              "requests": {
                "cpu": "1",
                "ephemeral-storage": "1Gi",
                "memory": "1Gi"
              }
            }
          }]
        }
      }
    },
    // 修改配置
    update: {
      manage: 'managePod',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // Metrics (节点和pod实时cpu 和内存接口）
  'NodeMetricsList': {
    allNodeMetrics: 'allNodeMetrics', // 批量获取节点Metrics
    batchPodMetrics: 'batchPodMetrics', // 批量获取PodMetrics
    batchNodeMetrics: 'batchNodeMetrics', // 获取节点Metrics
    managePodMetrics: 'managePodMetrics', // 获取PodMetrics
  },
  // 任务
  'JobList': {
    title: '任务', // 标题
    labelName: '任务', // 标签名
    list: 'batchJob', // 命名空间下的列表
    allList: 'allJob', // 集群下的列表
    manage: 'manageJob', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createJob',
      title: '创建Job', // 创建标题
      body: {
        "apiVersion": "batch/v1",
        "kind": "Job",
        "metadata": {
          "name": "example",
          "namespace": "cmp"
        },
        "spec": {
          "selector": {},
          "template": {
            "metadata": {
              "name": "pi"
            },
            "spec": {
              "containers": [{
                "command": ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"],
                "image": "113.108.106.175:444/library/perl:latest",
                "name": "pi"
              }],
              "restartPolicy": "Never"
            }
          }
        }
      },
    },
    // 修改配置
    update: {
      manage: 'manageJob',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // 定时任务
  'CronJobList': {
    title: '定时任务', // 标题
    labelName: '定时任务', // 标签名
    list: 'batchCronJob', // 命名空间下的列表
    allList: 'allCronJob', // 集群下的列表
    manage: 'manageCronJob', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createCronJob',
      title: '创建Pod', // 创建标题
      body: {
        "apiVersion": "batch/v1beta1",
        "kind": "CronJob",
        "metadata": {
          "name": "example",
          "namespace": "cmp"
        },
        "spec": {
          "jobTemplate": {
            "spec": {
              "template": {
                "spec": {
                  "containers": [{
                    "args": ["/bin/sh", "-c", "date; echo Hello from the Kubernetes cluster"],
                    "image": "113.108.106.175:444/library/busybox:latest",
                    "name": "hello"
                  }],
                  "restartPolicy": "OnFailure"
                }
              }
            }
          },
          "schedule": "@daily"
        }
      }
    },
    // 修改配置
    update: {
      manage: 'manageCronJob',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // 服务
  'ServiceList': {
    title: '服务', // 标题
    labelName: '服务', // 标签名
    list: 'batchServices', // 命名空间下的列表
    allList: 'allServices', // 集群下的列表
    manage: 'manageServices', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createServices',
      title: '创建Service', // 创建标题
      body: {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
          "name": "example",
          "namespace": "cmp"
        },
        "spec": {
          "ports": [{
            "name": "example",
            "port": 80,
            "protocol": "TCP",
            "targetPort": 90
          }],
          "selector": {
            "app": "example"
          },
          "sessionAffinity": "None",
          "type": "ClusterIP"
        }
      }
    },
    // 修改配置
    update: {
      manage: 'manageServices',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // 路由
  'IngressList': {
    title: '路由', // 标题
    labelName: '路由', // 标签名
    list: 'batchIngress', // 命名空间下的列表
    allList: 'allIngress', // 集群下的列表
    manage: 'manageIngress', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createIngress',
      title: '创建Ingress', // 创建标题
      body: {
        "apiVersion": "networking.k8s.io/v1",
        "kind": "Ingress",
        "metadata": {
          "name": "example",
          "namespace": "cmp"
        },
        "spec": {
          "rules": [{
            "host": "example",
            "http": {
              "paths": [{
                "path": "/example",
                "pathType": "Prefix",
                "backend": {
                  "service": {
                    "name": "example",
                    "port": {
                      "number": 8080
                    }
                  }
                }
              }]
            }
          }]
        }
      }
    },
    // 修改配置
    update: {
      manage: 'manageIngress',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
  // 配置
  'ConfigMapList': {
    title: '配置', // 标题
    labelName: '配置', // 标签名
    list: 'batchConfigMap', // 命名空间下的列表
    allList: 'allConfigMap', // 集群下的列表
    manage: 'manageConfigMap', // 详情、更新、删除
    // 创建配置
    create: {
      manage: 'createConfigMap',
      title: '创建ConfigMap', // 创建标题
      body: {
        "apiVersion": "v1",
        "kind": "ConfigMap",
        "metadata": {
          "name": "example",
          "namespace": "cmp"
        }
      }
    },
    // 修改配置
    update: {
      manage: 'manageConfigMap',
      title: '编辑YAML', // 创建标题
      body: '',
    },
  },
}

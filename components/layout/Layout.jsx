import { defineComponent, reactive, computed, watchEffect, Transition, watch, nextTick } from 'vue';
import Icon from '../icon';
import Modal from '../modal';
import LayoutHeader from './Header';
import Siderbar from './Siderbar';
import {
  message,
  Spin as ASpin,
  Input as AInput,
  Empty as AEmpty,
  Button as AButton,
  Dropdown as ADropdown,
  Menu as AMenu,
  MenuItem as AMenuItem,
} from 'ant-design-vue';
import axios from '../_utils/api';
import { RouterView, useRoute } from 'vue-router';
import isWindows from '../_utils/is-windows';
import { userStore, permissionStore, configStore } from '../_utils/store';
import { LoginMask } from '../login';

const Collection = defineComponent({
  props: {
    visible: Boolean,
  },
  setup(props, { attrs, slots, emit, expose }) {
    const collectionState = reactive({
      loading: false,
      isEmpty: false,
      product: [[], [], []],
      favorite: [],
      productName: undefined,
    });

    const isSearch = computed(() => {
      return (name) => collectionState.productName && name.includes(collectionState.productName);
    });

    async function getSubscribe(loading = true) {
      collectionState.loading = loading;
      try {
        let res = await axios.request({
          url: '/personal/permission/product/subscribe',
          method: 'get',
          headers: {
            'X-Project-Code': 'cyber-personal'
          },
        });
        collectionState.isEmpty = !res.data?.products?.length;
        collectionState.product = [[], [], []];
        (res.data?.products || []).forEach((item, index) => {
          let key = index % 3;
          collectionState.product[key].push(item);
        });
        collectionState.favorite = (res.data?.favorite || []).map(item => {
          return { ...item, isFavorite: true };
        });
      } catch(error) {
        collectionState.isEmpty = true;
        console.log('error', error);
      }
      collectionState.loading = false;
    }

    async function changeCollection(record) {
      try {
        let res = await axios.request({
          url: '/personal/permission/product/favorite',
          method: record.isFavorite ? 'delete' : 'post',
          data: { productId: record.id },
          headers: {
            'X-Project-Code': 'cyber-personal'
          },
        });
        message.success(res.message);
        getSubscribe(false);
      } catch(e) {
        throw Error(e);
      }
    }

    watchEffect(() => {
      if(props.visible) getSubscribe();
    });

    return () => {
      function productSlot() {
        if(collectionState.isEmpty) return <AEmpty></AEmpty>
        return (
          <div class="cyber-product-container">
            {
              (collectionState.product || []).map(column => {
                return (
                  <div class="cyber-product-column">
                    {
                      (column || []).map(item => {
                        return (
                          <div class="cyber-product-list">
                            <div>
                              <Icon icon={item.icon} isSvg size="16px" class="cyber-product-icon"></Icon>
                              { item.name }
                            </div>
                            <div>
                              {
                                (item.children || []).map(citem => {
                                  return (
                                    <div class={['cyber-product-item', { 'cyber-product-item-highlight': isSearch.value(citem.name) }]}>
                                      <div style="display: flex; align-items: center;">
                                        <Icon icon={citem.icon} size="16px" class="cyber-product-icon"></Icon>
                                        { citem.name }
                                      </div>
                                      <Icon
                                        isSvg
                                        size="16"
                                        style="cursor: pointer;"
                                        icon={ citem.isFavorite ? 'cyber-wujiaoxing-2' : 'cyber-wujiaoxing' }
                                        onClick={() => changeCollection(citem)}
                                      ></Icon>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </div>
        )
      }
      function favoriteSlot() {
        if(!collectionState.favorite?.length) {
          return <AEmpty></AEmpty>
        }
        return (collectionState.favorite || []).map(item => {
          return (
            <div class="cyber-favorite-item">
              <div>
                <Icon icon={item.icon} isSvg size="16px" class="cyber-product-icon"></Icon>
                <span>{ item.name }</span>
              </div>
              <div class="cyber-favorite-action">
                <Icon icon="cyber-close" isSvg size="12px" class="cyber-close-icon" onClick={() => changeCollection(item)}></Icon>
              </div>
            </div>
          )
        });
      }
      return (
        <ASpin spinning={collectionState.loading} tip="Loading...">
          <div class="cyber-collection">
            <div class="cyber-product-body">
              <AInput v-model:value={collectionState.productName} placeholder="输入名称进行搜索"></AInput>
              <div class="cyber-product-scroll">
                { productSlot() }
              </div>
            </div>
            <div class="cyber-favorite-list">
              { favoriteSlot() }
            </div>
          </div>
        </ASpin>
      );
    }
  }
});

export default defineComponent({
  name: 'CLayout',
  props: {
    logo: String,
    loginLogo: String,
    logout: Function,
    loading: {
      type: Boolean,
      default: false,
    },
    showSiderbar: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const $useRoute = useRoute();
    const $userStore = userStore();
    const $configStore = configStore();
    const $permissionStore = permissionStore();
    
    const layoutState = reactive({
      visible: false,
      componentKey: undefined,
      isAlive: true,
    });
    const logo = computed(() => {
      return props.logo || $configStore.layoutLogo;
    });
    const workInfo = computed(() => {
      const { userDeptInfo = [], positionInfo = [] } = $userStore.info || {};
      return [...userDeptInfo, ...positionInfo].map((item, index) => {
        return (index != '0' ? ' | ' : '') + item.name;
      }).join('');
    });
    
    function logout() {
      if(props.logout) {
        props.logout();
        return;
      }
      Modal.confirm({
        width: '400px',
        content: `确定要退出登录吗？`,
        okButtonProps: {
          danger: true,
        },
        onOk: async () => {
          await $userStore.logout();
          if(isWindows()) {
            window.location.reload();
          }
          return Promise.resolve();
        }
      });
    }
    function onShowCollections() {
      layoutState.visible = true;
    }
    function onCollectionCancel() {
      $permissionStore.generateRoutes();
    }
    function updateComponentKey() {
      return new Date().getTime();
    }
    function reload() {
      layoutState.isAlive = false;
      nextTick(() => layoutState.isAlive = true);
    }
    function onFinish(replace) {
      if(!replace) reload();
    }

    watch(() => $useRoute.path, () => {
      layoutState.componentKey = updateComponentKey();
    }, { immediate: true, deep: true });
    expose({
      reload: reload,
      showCollections: onShowCollections,
    });    
    return () => {
      function loadingSlot() {
        if(!props.loading) return;
        return (
          <div class="cyber-layout-body-loading">
            <ASpin size="large" tip="Loading..." />
          </div>
        )
      }
      function siderbarSlot() {
        if(!props.showSiderbar) return;
        return <Siderbar onShowCollections={onShowCollections} />
      }
      function collectionSlot() {
        return (
          <Modal
            width="1000px"
            title="管理收藏"
            class="cyber-collection-modal"
            footer={null}
            v-model:visible={layoutState.visible}
            onCancel={onCollectionCancel}
          >
            <Collection visible={layoutState.visible}></Collection>
          </Modal>
        )
      }
      function routerViewSlot() {
        if(!layoutState.isAlive) return;
        return (
          <RouterView v-slots={{
            default: ({ Component }) => {
              if(!Component.key) Component.key = layoutState.componentKey;
              return <Transition name="cyber-layout-fade" mode="out-in" appear>{ Component }</Transition>
            }}}
          ></RouterView>
        );
      }
      const headerSlots = {
        logo: slots.logo,
        left: slots.left,
        tools: () => {
          if(slots.tools) return slots.tools();
          if(!$configStore.tools?.length) return;
          return (
            <AMenu class="cyber-user-tools-ul">
              {
                $configStore.tools.map(item => {
                  return <>
                    { item.separate ? <div class="cyber-user-tools-separate"></div> : undefined }
                    <AMenuItem
                      disabled={item.disabled}
                      v-slots={{ icon: () => <Icon icon={item.icon} size="16" /> }}
                    >
                      <a href={item.href} target={item.target} onClick={() => item.handler?.()}>{ item.label }</a>
                    </AMenuItem>
                  </>
                })
              }
            </AMenu>
          )
        },
        right: () => {
          if(slots.right) return slots.right();
          function overlaySlot() {
            if(props.overlay) return props.overlay();
            const { phone, email } = $userStore.info || {};
            function containerClick(event) {
              event.stopPropagation();
              event.preventDefault();
            }
            return (
              <div class="cyber-user-tools">
                <div class="cyber-user-container" onClick={containerClick}>
                  <div class="cyber-user-info">
                    <img src={$userStore.avatar} class="cyber-user-avatar" />
                    <div class="cyber-user-basic-info">
                      <div>{ $userStore.name || '-' } | { $userStore.userName || '-' }</div>
                      <div class="cyber-user-work-info" title={workInfo.value}>
                        { workInfo.value || '-' }
                      </div>
                    </div>
                  </div>
                  <div class="cyber-user-contact-info">
                    <div>
                      <Icon icon="cyber-dianhua" isSvg size="14"></Icon>
                      { phone || '-' }
                    </div>
                    <div style="margin-top: 12px;">
                      <Icon icon="cyber-youxiang" isSvg size="14"></Icon>
                      { email || '-' }
                    </div>
                  </div>
                </div>
                { headerSlots.tools?.() }
                <div class="cyber-logout-tools">
                  <AButton danger shape="round" onClick={logout}>
                    <Icon icon="cyber-tuichuzhanghao" size="16" isSvg></Icon>
                    退出登录
                  </AButton>
                </div>
              </div>
            )
          }
          return (
            <ADropdown
              trigger="click"
              destroyPopupOnHide
              placement="bottomRight"
              overlayClassName="cyber-tool-dropdown"
              v-slots={{ overlay: overlaySlot }}
            >
              <div class="cyber-user">
                <img src={$userStore.avatar} class="cyber-user-avatar" />
                <span style="margin: 0 8px;">{$userStore.name}</span>
                <Icon icon="cyber-drop-down" color="#FFFFF" size="16"></Icon>
              </div>
            </ADropdown>
          )
        }
      }
      return (
        <div class="cyber-layout">
          <LayoutHeader v-slots={headerSlots} logo={logo.value}></LayoutHeader>
          <div class="cyber-layout-content">
            <Transition name="cyber-sider-fade" mode="out-in">{ siderbarSlot() }</Transition>
            <div class="cyber-layout-body">
              { routerViewSlot() }
            </div>
          </div>
          { loadingSlot() }
          { collectionSlot() }
          <LoginMask logo={props.loginLogo} onFinish={onFinish}></LoginMask>
        </div>
      );
    }
  },
});

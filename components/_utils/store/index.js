import { createPinia } from "pinia";

const store = createPinia();

export { default as dictStore } from './modules/dict.js';

export { default as userStore } from './modules/user.js';

export { default as configStore, analysisVariate } from './modules/config.js';

export { default as maintainStore } from './modules/maintain.js';

export { default as permissionStore, rerenderPermissionNodes } from './modules/permission.js';

export const instance = store;

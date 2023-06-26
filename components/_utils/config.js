import isWindows from './is-windows.js';

export const API_URL = import.meta.env.VITE_API_URL;

export const API_WEBSOCKET = /^ws/.test(import.meta.env.VITE_API_WEBSOCKET)
	? import.meta.env.VITE_API_WEBSOCKET
	: isWindows()
    ? window.location.origin.replace(/^https/, 'wss').replace(/^http/, 'ws') + import.meta.env.VITE_API_WEBSOCKET
    : undefined;
  
export const PRODUCT_CODE = import.meta.env.VITE_PRODUCT_CODE;

export const IS_SYSTEM_CONFIG = import.meta.env.VITE_IS_SYSTEM_CONFIG === "true";

export const COPYRIGHT = import.meta.env.VITE_COPYRIGHT;

export const HOME_PATH = import.meta.env.VITE_HOME_PATH;

export const TOOLS = import.meta.env.VITE_TOOLS;

export const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH;

export const LOGIN_LOGO = import.meta.env.VITE_LOGIN_LOGO;

export const LAYOUT_LOGO = import.meta.env.VITE_LAYOUT_LOGO;

export const LOGIN_BACKGROUND = import.meta.env.VITE_LOGIN_BACKGROUND;

export const PWD_ENC_KEY = import.meta.env.VITE_PWD_ENC_KEY;

export const DOCUMENT_ADDRESS = import.meta.env.VITE_DOCUMENT_ADDRESS || '';

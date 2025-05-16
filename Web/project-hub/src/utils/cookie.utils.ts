import { cookies } from 'next/headers';
import { COOKIE_CONFIG } from '@/config/api.config';

export const getCookie = (name: string) => {
  const cookieStore = cookies();
  return cookieStore.get(name)?.value;
};

export const setCookie = (name: string, value: string, options?: any) => {
  const cookieStore = cookies();
  cookieStore.set(name, value, options);
};

export const removeCookie = (name: string) => {
  const cookieStore = cookies();
  cookieStore.delete(name);
};

export const getAuthToken = () => {
  return getCookie(COOKIE_CONFIG.AUTH_TOKEN.name);
};

export const setAuthToken = (token: string) => {
  setCookie(COOKIE_CONFIG.AUTH_TOKEN.name, token, COOKIE_CONFIG.AUTH_TOKEN.options);
};

export const getRefreshToken = () => {
  return getCookie(COOKIE_CONFIG.REFRESH_TOKEN.name);
};

export const setRefreshToken = (token: string) => {
  setCookie(COOKIE_CONFIG.REFRESH_TOKEN.name, token, COOKIE_CONFIG.REFRESH_TOKEN.options);
};

export const clearAuthCookies = () => {
  removeCookie(COOKIE_CONFIG.AUTH_TOKEN.name);
  removeCookie(COOKIE_CONFIG.REFRESH_TOKEN.name);
}; 
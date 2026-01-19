// Cookies

import { DOMAIN, EXPIRES, PATH, SAMESITE, SECURE } from "./constants";

export const getCookie = (name: string): string | null => {
  const indexOfCookieName = document.cookie.indexOf(name + "=");
  if (indexOfCookieName >= 0) {
    const startIndexOfCookieValue = indexOfCookieName + name.length + 1;
    let endIndexOfCookieValue = document.cookie.indexOf(";", startIndexOfCookieValue);
    if (endIndexOfCookieValue < 0) {
      endIndexOfCookieValue = document.cookie.length;
    }

    if (startIndexOfCookieValue >= 0 && endIndexOfCookieValue > startIndexOfCookieValue) {
      return document.cookie.substring(startIndexOfCookieValue, endIndexOfCookieValue);
    }
  }

  return null;
};

export const setCookie = (
  name: string,
  value: string,
  expires?: Date,
  path: string = "/",
  domain?: string,
  secure: boolean = false,
  sameSite: string = "strict",
): void => {
  let cookie = `${name} = ${value}`;
  if (expires) {
    cookie += `; ${EXPIRES} = ${expires.toUTCString()}`;
  }
  if (path) {
    cookie += `; ${PATH} = ${path}`;
  }
  if (domain) {
    cookie += `; ${DOMAIN} = ${domain}`;
  }
  if (secure) {
    cookie += `; ${SECURE} = ${secure}`;
  }
  if (sameSite) {
    cookie += `; ${SAMESITE} = ${sameSite}`;
  }
  document.cookie = cookie;
};

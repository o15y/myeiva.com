import { elementToObject } from "~/util/element-to-object";
import axios from "axios";

const UAParser = require("ua-parser-js");
const lastNChars = (N: number, str: string) => str.substr(str.length - N);

const generateId = () =>
  `${Math.random()
    .toString(36)
    .substr(2, 5)}${lastNChars(5, new Date().getTime().toString())}`;

let anonymousLocalId = generateId();
if (typeof localStorage.getItem("anonymousLocalId") === "string") {
  anonymousLocalId = localStorage.getItem("anonymousLocalId") as string;
} else {
  localStorage.setItem("anonymousLocalId", anonymousLocalId);
}

let anonymousSessionId = generateId();
if (typeof sessionStorage.getItem("anonymousSessionId") === "string") {
  anonymousSessionId = sessionStorage.getItem("anonymousSessionId") as string;
} else {
  sessionStorage.setItem("anonymousSessionId", anonymousSessionId);
}

const clean = (obj: any) => {
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] === "" || obj[key] === null || obj[key] === undefined)
      delete obj[key];
  });
  return obj;
};

export default () => {
  if (process.client) {
    const track = async (event: string, data?: any) => {
      let timezone: string | undefined = undefined;
      try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (error) {}
      let uaData: any = {};
      try {
        const parser = new UAParser(window.navigator.userAgent);
        const browser = parser.getBrowser();
        const device = parser.getDevice();
        const os = parser.getOS();
        uaData = {
          browserName: browser.name,
          browserVersion: browser.version,
          browserMajor: browser.major,
          deviceType: device.type,
          deviceModel: device.model,
          deviceVendor: device.vendor,
          osName: os.name,
          osVersion: os.version,
        };
      } catch (error) {}
      const body = clean({
        ...data,
        ...uaData,
        hash: window.location.hash,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        port: window.location.port,
        protocol: window.location.protocol,
        search: window.location.search,
        referrer: document.referrer,
        language: window.navigator.language,
        availableResolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
        nativeResolution: `${window.screen.width *
          window.devicePixelRatio}x${window.screen.height *
          window.devicePixelRatio}`,
        absoluteResolution: `${window.screen.width}x${window.screen.height}`,
        timezone,
        localDate: new Date().toLocaleString("en-us"),
        anonymousLocalId,
        anonymousSessionId,
      });
      if (window.location.hostname === "localhost")
        return console.log("Tracking", event, body);
      axios
        .post(
          `${
            process.env.NODE_ENV === "production"
              ? "https://api.myeiva.com/v1"
              : "http://localhost:7007/v1"
          }/api/track/${event}`,
          body
        )
        .then(() => {})
        .catch(() => {});
    };
    let currentUrl = window.location.href;
    track("pageview");
    window.setInterval(() => {
      const newUrl = window.location.href;
      if (currentUrl !== newUrl) {
        track("pageview");
        currentUrl = newUrl;
      }
    }, 1000);
    if (!document.body) return;
    document.body.addEventListener("click", (event) => {
      if (!event.target) return;
      const target = elementToObject(event.target as Element);
      track("click", {
        targetSelector: target?.selector,
        targetTagName: target?.tagName,
        targetContent: target?.textContent,
        altKey: event.altKey,
        clientX: event.clientX,
        clientY: event.clientY,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        movementX: event.movementX,
        movementY: event.movementY,
        offsetX: event.offsetX,
        offsetY: event.offsetY,
        pageX: event.pageX,
        pageY: event.pageY,
        screenX: event.screenX,
        screenY: event.screenY,
        shiftKey: event.shiftKey,
      });
    });
  }
};

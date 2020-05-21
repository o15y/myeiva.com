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
    if (!obj[key]) {
      delete obj[key];
    } else {
      obj[key] = String(obj[key]);
    }
  });
  return obj;
};

export default ({ $axios }: { $axios: any }) => {
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
        timezone,
        localDate: new Date().toLocaleString("en-us"),
        anonymousLocalId,
        anonymousSessionId,
      });
      console.log("Tracking", event, body);
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
  }
};

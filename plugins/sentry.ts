import { init } from "@sentry/browser";

export default () => {
  if (process.client) {
    init({
      dsn:
        "https://957d1a6c8ebc443f9bf3136dcc77a948@o400462.ingest.sentry.io/5258918",
    });
  }
};

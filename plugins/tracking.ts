export default ({ $axios }: { $axios: any }) => {
  console.log("Tracking plugin", $axios);
  if (process.client) {
    console.log("Process is client", document.body);
  }
};

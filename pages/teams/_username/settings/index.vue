<template>
  <div>Loading...</div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from "vue-property-decorator";

  @Component({
    middleware: "authenticated",
    layout: "teams",
  })
  export default class TeamsHome extends Vue {
    mounted() {
      this.$router.replace("./settings/assistant");
    }
  }
</script>

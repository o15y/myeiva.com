<template>
  <footer class="footer">
    <div class="container">
      <nav class="column bottom-nav">
        <span>&copy; {{ year }} O15Y</span>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  @Component
  export default class Footer extends Vue {
    year = new Date().getFullYear();
  }
</script>

<style>
  .bottom-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .bottom-nav * + * {
    margin-left: 2rem;
  }
</style>

<template>
  <div>
    <h1 class="is-size-4">Extensions</h1>
    <form @submit.prevent="save">
      <h2 class="is-size-5" style="margin: 1rem 0">Clearbit</h2>
      <p style="margin-bottom: 1rem">
        The Clearbit API helps us find details about your guests. You can use
        your own Clearbit API key, if you prefer.
        <a href="#">Learn how to get an API key</a>
      </p>
      <b-field>
        <b-checkbox v-model="team.useClearbit">
          Use Clearbit to enrich guest details
        </b-checkbox>
      </b-field>
      <b-field label="Custom API key">
        <b-input type="text" v-model="team.clearbitApiKey" />
      </b-field>
      <h2 class="is-size-5" style="margin: 1rem 0">Google Calendar</h2>
      <p style="margin-bottom: 1rem">
        If you want to connect your Google Calendar, you can add your access
        token and refresh token here.
        <a href="#">Learn how to generate your tokens</a>
      </p>
      <b-field label="Access token">
        <b-input type="text" v-model="team.googleAccessToken" />
      </b-field>
      <b-field label="Refresh token">
        <b-input type="text" v-model="team.googleRefreshToken" />
      </b-field>
      <div style="margin-top: 1rem">
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">
          Update extension settings
        </b-button>
      </div>
      <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    </form>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from "vue-property-decorator";
  @Component({
    middleware: "authenticated",
    layout: "teams",
  })
  export default class TeamsHome extends Vue {
    loading = false;
    loadingSave = false;
    team: any = {};

    async mounted() {
      return this.get();
    }

    async get() {
      this.loading = true;
      try {
        const { data } = await this.$axios.get(
          `/organizations/${this.$route.params.username}`
        );
        this.team = data;
      } catch (error) {}
      this.loading = false;
    }

    async save() {
      this.loadingSave = true;
      try {
        const { data } = await this.$axios.patch(
          `/organizations/${this.$route.params.username}`,
          {
            useClearbit: this.team.useClearbit,
            clearbitApiKey: this.team.clearbitApiKey || "",
            googleAccessToken: this.team.googleAccessToken || "",
            googleRefreshToken: this.team.googleRefreshToken || "",
          }
        );
        this.team = data.updated;
      } catch (error) {}
      this.loadingSave = false;
    }
  }
</script>

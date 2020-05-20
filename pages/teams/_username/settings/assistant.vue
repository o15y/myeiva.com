<template>
  <div>
    <h1 class="is-size-4">Assistant settings</h1>
    <form @submit.prevent="save" style="margin-top: 1rem">
      <b-field label="Name">
        <b-input type="text" v-model="team.assistantName" required />
      </b-field>
      <b-field
        label="Email suffix"
        :message="
          `Your assistant email will be meet-${team.username ||
            'your_username'}@mail.araassistant.com`
        "
      >
        <b-input type="text" v-model="team.username" required />
      </b-field>
      <b-field label="Signature">
        <b-input type="textarea" v-model="team.assistantSignature" required />
      </b-field>
      <div style="margin-top: 1rem">
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">
          Update assistant settings
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

    async created() {
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
            assistantName: this.team.assistantName,
          }
        );
        this.team = data.updated;
      } catch (error) {}
      this.loadingSave = false;
    }
  }
</script>

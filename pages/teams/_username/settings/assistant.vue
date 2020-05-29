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
      <b-field>
        <b-checkbox v-model="team.unsubscribeLink">
          Add an unsubscribe link in the signature of every email
        </b-checkbox>
      </b-field>
      <b-field>
        <b-checkbox v-model="team.readReceipts">
          Track read receipts for outgoing emails
        </b-checkbox>
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
  import Shepherd from "shepherd.js";
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark",
      scrollTo: true,
    },
  });
  tour.addStep({
    text:
      "You can set whatever name you like for your assistant. Get creative!",
    attachTo: {
      element: ".card .field:nth-child(1)",
      on: "left",
    },
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });
  tour.addStep({
    text:
      "If you want to say something special in the signature, you can update that here.",
    attachTo: {
      element: ".card .field:nth-child(3)",
      on: "left",
    },
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });
  tour.addStep({
    text: "You can enable unsubscribe links in the signature",
    attachTo: {
      element: ".card .field:nth-child(4)",
      on: "left",
    },
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });
  tour.addStep({
    text:
      "If you want to know when people have read your assistant's emails, you can enable tracking",
    attachTo: {
      element: ".card .field:nth-child(5)",
      on: "left",
    },
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });
  tour.addStep({
    text: "Save your settings and click on Scheduling settings to continue",
    attachTo: {
      element: "ul ul li:nth-child(2)",
      on: "left",
    },
  });

  @Component({
    middleware: "authenticated",
    layout: "teams",
  })
  export default class TeamsHome extends Vue {
    loading = false;
    loadingSave = false;
    team: any = {};

    async mounted() {
      tour.start();
      return this.get();
    }

    beforeDestroy() {
      tour.complete();
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

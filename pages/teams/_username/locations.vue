<template>
  <div>
    <h1 class="is-size-4">Locations</h1>
    <b-table
      :loading="loading"
      :data="location.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="type" label="Type">
          <span>{{ locationTypeLabel(props.row.type) }}</span>
        </b-table-column>
        <b-table-column sortable field="value" label="Location">
          <span>{{ truncate(locationName(props.row)) }}</span>
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Remove">
            <b-button
              type="is-danger"
              icon-right="delete"
              @click="deleteLocation(props.row.id)"
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="location.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >
        Load more location
      </b-button>
    </div>
    <h2 class="is-size-5" style="margin-top: 1rem">Add location</h2>
    <form @submit.prevent="add" style="margin-top: 0.5rem">
      <b-field label="Type">
        <div class="block">
          <b-radio
            v-model="newLocationType"
            name="newLocationType"
            native-value="VIDEO_CALL"
          >
            {{ locationTypeLabel("VIDEO_CALL") }}
          </b-radio>
          <b-radio
            v-model="newLocationType"
            name="newLocationType"
            native-value="PHONE_CALL"
          >
            {{ locationTypeLabel("PHONE_CALL") }}
          </b-radio>
          <b-radio
            v-model="newLocationType"
            name="newLocationType"
            native-value="IN_PERSON"
          >
            {{ locationTypeLabel("IN_PERSON") }}
          </b-radio>
        </div>
      </b-field>
      <div class="columns">
        <div class="column" v-if="newLocationType === 'VIDEO_CALL'">
          <b-field label="Service">
            <b-select
              placeholder="Select a service"
              v-model="newLocationService"
              expanded
            >
              <option>Jitsi Meet</option>
              <option>Zoom</option>
              <option>Google Meet</option>
              <option>Skype</option>
              <option>Whereby</option>
              <option>Messenger</option>
              <option>Telegram</option>
              <option>WhatsApp</option>
              <option>Viber</option>
              <option>Houseparty</option>
              <option>Signal</option>
              <option>LINE</option>
              <option>WeChat</option>
              <option>Other</option>
            </b-select>
          </b-field>
        </div>
        <div class="column">
          <b-field :label="newLocationLabel" :message="newLocationMessage">
            <b-input
              :icon="
                newLocationType === 'IN_PERSON'
                  ? 'map'
                  : newLocationType === 'VIDEO_CALL'
                  ? 'link'
                  : 'phone'
              "
              type="text"
              v-model="newLocationValue"
              required
            />
          </b-field>
        </div>
      </div>
      <b-button type="is-primary" native-type="submit" :loading="loadingAdd">
        Add location
      </b-button>
    </form>
    <form @submit.prevent="save" style="margin-top: 1rem">
      <h1 class="is-size-5" style="margin: 1rem 0">Default location</h1>
      <b-field>
        <b-select v-model="team.schedulingLocation" expanded required>
          <option
            v-for="(location, index) in location.data"
            :value="location.id"
            :key="`l${index}${location.id}`"
          >
            {{ locationName(location) }}
          </option>
        </b-select>
      </b-field>
      <div style="margin-top: 1rem">
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">
          Update domain settings
        </b-button>
      </div>
      <b-loading
        :is-full-page="false"
        :active.sync="loadingSettings"
      ></b-loading>
    </form>
  </div>
</template>

<script lang="ts">
  import { mapGetters } from "vuex";
  import { Vue, Component, Watch } from "vue-property-decorator";
  import { truncate } from "../../../util/string";
  import Shepherd from "shepherd.js";
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark",
      scrollTo: true,
    },
  });
  tour.addStep({
    text:
      "You can see your meeting locations here. We've already added a unique video chat link for you.",
    attachTo: {
      element: ".card-content h1",
      on: "bottom",
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
      "Add some more locations, like phone numbers and addresses. Your assistant will recommend these locations.",
    attachTo: {
      element: ".card-content h2",
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
    text: "Once you're done adding locations, click on Settings to continue.",
    attachTo: {
      element: ".menu-list li:nth-child(3)",
      on: "left",
    },
  });

  @Component({
    middleware: "authenticated",
    layout: "teams",
  })
  export default class UsersProfile extends Vue {
    loading = false;
    loadingAdd = false;
    loadingSave = false;
    loadingSettings = false;
    location: any = { data: [] };
    team: any = {};
    truncate = truncate;

    newLocationValue = "";
    newLocationType = "VIDEO_CALL";
    newLocationService = "Jitsi Meet";

    async mounted() {
      if (!localStorage.getItem("tour-finished")) tour.start();
      this.loadingSettings = true;
      try {
        const { data } = await this.$axios.get(
          `/organizations/${this.$route.params.username}?select=schedulingLocation`
        );
        this.team = data;
      } catch (error) {}
      this.loadingSettings = false;
      return this.get();
    }

    beforeDestroy() {
      tour.complete();
    }

    async get() {
      this.loading = true;
      try {
        const { data } = await this.$axios.get(
          `/organizations/${this.$route.params.username}/locations?first=10${
            this.location.data.length
              ? `&after=${this.location.data[this.location.data.length - 1].id}`
              : ""
          }`
        );
        this.location.data.push(...(data.data || []));
        this.location.hasMore = data.hasMore;
        this.location = data;
      } catch (error) {}
      this.loading = false;
    }

    async add() {
      this.loadingAdd = true;
      try {
        const { data } = await this.$axios.put(
          `/organizations/${this.$route.params.username}/locations`,
          {
            value: this.newLocationValue,
            type: this.newLocationType,
            data:
              this.newLocationService &&
              this.newLocationService !== "Other" &&
              this.newLocationType === "VIDEO_CALL"
                ? JSON.stringify({
                    name: this.newLocationService,
                    template: "{{name}}: {{value}}",
                  })
                : undefined,
          }
        );
        this.location.data.push(data.added);
        this.newLocationValue = "";
        this.newLocationType = "";
      } catch (error) {}
      this.loadingAdd = false;
    }

    async save() {
      this.loadingSave = true;
      try {
        const { data } = await this.$axios.patch(
          `/organizations/${this.$route.params.username}`,
          {
            schedulingLocation: this.team.schedulingLocation,
          }
        );
        this.team = data.updated;
      } catch (error) {}
      this.loadingSave = false;
    }

    async deleteLocation(id: number) {
      this.$buefy.dialog.confirm({
        title: "Removing location",
        message: `Are you sure you want to remove this location? This action is not reversible, and you'll have to add it again if you change your mind.`,
        confirmText: "Yes, remove location",
        cancelText: "No, don't remove",
        type: "is-danger",
        hasIcon: true,
        trapFocus: true,
        onConfirm: async () => {
          this.loading = true;
          try {
            await this.$axios.delete(
              `/organizations/${this.$route.params.username}/locations/${id}`
            );
          } catch (error) {}
          this.location = { data: [] };
          return this.get();
        },
      });
    }

    locationTypeLabel(key: string) {
      if (key === "IN_PERSON") return "In-person meeting";
      if (key === "PHONE_CALL") return "Phone call";
      if (key === "VIDEO_CALL") return "Video call";
      return key;
    }

    locationName(location: any) {
      if (location.data) {
        let data: any = {};
        try {
          data = JSON.parse(location.data);
        } catch (error) {}
        if (data.template) {
          let result = data.template;
          Object.keys(data).forEach((key) => {
            result = result.replace(`{{${key}}}`, data[key]);
          });
          Object.keys(location).forEach((key) => {
            result = result.replace(`{{${key}}}`, location[key]);
          });
          if (result) return result;
        }
      }
      return location.value;
    }

    get newLocationLabel() {
      if (this.newLocationType === "IN_PERSON") return "Address";
      if (this.newLocationType === "PHONE_CALL") return "Phone number";
      if (this.newLocationType === "VIDEO_CALL") return "URL or details";
      return "Details";
    }

    get newLocationMessage() {
      if (this.newLocationType === "PHONE_CALL")
        return "Phone number with country code";
      if (
        this.newLocationType === "VIDEO_CALL" &&
        ["Jitsi Meet", "Zoom", "Google Meet", "Whereby"].includes(
          this.newLocationService
        )
      )
        return "Link to join the call";
      if (
        this.newLocationType === "VIDEO_CALL" &&
        [
          "Messenger",
          "Skype",
          "Telegram",
          "WhatsApp",
          "Viber",
          "Houseparty",
          "Signal",
          "LINE",
          "WeChat",
        ].includes(this.newLocationService)
      )
        return "Phone number or username to call";
      if (this.newLocationType === "VIDEO_CALL")
        return "Details to join call (like a link or username)";
      return;
    }
  }
</script>

<template>
  <div v-if="completed">
    <b-icon
      icon="check-circle"
      size="is-large"
      type="is-success"
      style="margin-bottom: 1rem"
    />
    <h1 class="title is-4">Appointment confirmed</h1>
    <div class="content">
      <p>
        You'll a receive a confirmation email with a calendar invitation in a
        few moments.
      </p>
    </div>
  </div>
  <div v-else>
    <div style="margin-bottom: 1.5rem; display: flex; justify-content: center">
      <figure
        class="image avatar is-64x64"
        v-if="user.profilePicture || user.name"
      >
        <img
          class="is-rounded"
          :src="
            user.profilePicture ||
              `https://ui-avatars.com/api/?name=${user.name}&background=3498db&color=fff`
          "
        />
      </figure>
      <figure class="image avatar is-64x64">
        <img
          class="is-rounded"
          :src="
            guestPicture ||
              `https://ui-avatars.com/api/?name=${guestName}&background=e74c3c&color=fff`
          "
        />
      </figure>
    </div>
    <h1 class="title is-5 has-text-centered">👋 Hi, {{ guestName }}!</h1>
    <div class="content">
      <p>
        Schedule your {{ duration }}-minute appointment with {{ user.name }}.
      </p>
      <form @submit.prevent="save">
        <b-field label="Date and time">
          <b-datetimepicker
            placeholder="Click to select..."
            icon="calendar-today"
            v-model="selectedDatetime"
            :timepicker="{ hourFormat: '12' }"
            horizontal-time-picker
            editable
          ></b-datetimepicker>
        </b-field>
        <b-field v-if="showTimezone">
          <template slot="label">
            Timezone
            <b-tooltip
              type="is-dark"
              label="We need your timezone to show you local times"
            >
              <b-icon size="is-small" icon="help-circle-outline"></b-icon>
            </b-tooltip>
          </template>
          <b-select
            placeholder="Select a timezone"
            v-model="guestTimezone"
            expanded
          >
            <option
              v-for="(timezone, i) in filteredTimezonesArray"
              :value="timezone"
              :key="`t${i}${timezone}`"
              >{{ timezone }}</option
            >
          </b-select>
        </b-field>
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">
          Confirm appointment
        </b-button>
        <b-collapse
          style="margin-top: 1rem"
          :open="false"
          aria-id="advancedSettings"
        >
          <button
            class="button is-light is-small"
            slot="trigger"
            type="button"
            aria-controls="advancedSettings"
          >
            Advanced settings
          </button>
          <div style="margin-top: 1rem">
            <b-field label="Name">
              <b-input v-model="guestName" type="text" />
            </b-field>
            <b-field label="Email">
              <b-input v-model="guestEmail" type="email" />
            </b-field>
            <b-field label="Duration">
              <b-select
                placeholder="Select a duration"
                v-model="duration"
                expanded
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </b-select>
            </b-field>
            <b-field v-if="!showTimezone">
              <template slot="label">
                Timezone
                <b-tooltip
                  type="is-dark"
                  label="We need your timezone to show you local times"
                >
                  <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                </b-tooltip>
              </template>
              <b-select
                placeholder="Select a timezone"
                v-model="guestTimezone"
                expanded
              >
                <option
                  v-for="(timezone, i) in filteredTimezonesArray"
                  :value="timezone"
                  :key="`t${i}${timezone}`"
                  >{{ timezone }}</option
                >
              </b-select>
            </b-field>
          </div>
        </b-collapse>
      </form>
      <p style="margin-top: 1rem">
        We'll send you a calendar invitation over email on confirmation.
      </p>
    </div>
    <b-loading :active="loading" />
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component } from "vue-property-decorator";
  import decode from "jwt-decode";
  import ct from "countries-and-timezones";

  interface TokenResult {
    duration: number;
    datetime: Date;
    guests: {
      address: string;
      company: {
        id: string;
      } | null;
      name: string;
      person: {
        id: string;
        avatar?: string;
        timeZone?: string;
      } | null;
    }[];
    timezone: string;
  }

  @Component({
    layout: "meet",
  })
  export default class Confirm extends Vue {
    guestName = "";
    guestEmail = "";
    guestTimezone = "America/Los_Angeles";
    guestPicture = "";
    duration = 30;
    selectedDatetime = new Date();

    token?: TokenResult;
    showTimezone = false;
    meetingType: string = "";
    confirmedTime: Date | undefined = undefined;
    organization: any = {};
    user: any = {};
    proposedTimes: any[] = [];
    filteredTimezonesArray = Object.keys(ct.getAllTimezones());

    loading = false;
    loadingSave = false;
    completed = false;

    async mounted() {
      if (typeof this.$route.query.token !== "string")
        return this.$router.replace("/");
      this.token = decode<TokenResult>(this.$route.query.token);
      this.guestTimezone = this.token.timezone;
      this.guestName = this.token.guests[0].name;
      this.guestEmail = this.token.guests[0].address;
      this.guestPicture = this.token.guests[0].person?.avatar ?? "";
      this.selectedDatetime = new Date(this.token.datetime);
      this.loading = true;
      try {
        const result = (
          await this.$axios.get(
            `/api/meeting-page/${this.$route.params.username}/${
              this.$route.params.meetingId
            }?jwt=${encodeURIComponent(this.$route.query.token)}`
          )
        ).data;
        this.proposedTimes = JSON.parse(result.proposedTimes);
        this.user = result.user;
        this.organization = result.organization;
        this.meetingType = result.meetingType;
      } catch (error) {}
      try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (this.guestTimezone !== userTimezone) this.showTimezone = true;
        this.guestTimezone = userTimezone;
      } catch (error) {}
      this.loading = false;
    }

    async save() {
      this.loadingSave = true;
      try {
        await this.$axios.post(
          `/api/confirm-meeting/${this.$route.params.username}/${this.$route.params.meetingId}`,
          {
            token: this.$route.query.token,
            guestName: this.guestName,
            guestEmail: this.guestEmail,
            guestTimezone: this.guestTimezone,
            duration: this.duration,
            selectedDatetime: this.selectedDatetime.toISOString(),
          }
        );
      } catch (error) {}
      this.loadingSave = false;
      this.completed = true;
    }
  }
</script>

<style scoped>
  .avatar img {
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  }
  .avatar {
    margin: 0 -10px;
  }
</style>

<template>
  <div>
    <h1 class="title is-4">Appointment</h1>
    <div class="content">
      <p>Your name etc.</p>
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
        <b-field>
          <template slot="label">
            Timezone
            <b-tooltip type="is-dark" label="We need your timezone to show you local times">
              <b-icon size="is-small" icon="help-circle-outline"></b-icon>
            </b-tooltip>
          </template>
          <b-select placeholder="Select a timezone" v-model="guestTimezone" expanded>
            <option
              v-for="(timezone, i) in filteredTimezonesArray"
              :value="timezone"
              :key="`t${i}${timezone}`"
            >{{ timezone }}</option>
          </b-select>
        </b-field>
        <b-field label="Name">
          <b-input v-model="guestName" type="text" required />
        </b-field>
        <b-field label="Email">
          <b-input v-model="guestEmail" type="email" required />
        </b-field>
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">Confirm appointment</b-button>
      </form>
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
  layout: "meet"
})
export default class Confirm extends Vue {
  guestName = "";
  guestEmail = "";
  guestTimezone = "America/Los_Angeles";
  guestPicture = "";
  selectedDatetime = new Date();

  token?: TokenResult;
  duration = 30;
  meetingType: string = "";
  confirmedTime: Date | undefined = undefined;
  organization: any | undefined = undefined;
  user: any | undefined = undefined;
  proposedTimes: any[] = [];
  filteredTimezonesArray = Object.keys(ct.getAllTimezones());

  loading = false;
  loadingSave = false;

  async mounted() {
    if (typeof this.$route.query.token !== "string")
      return this.$router.replace("/");
    this.token = decode<TokenResult>(this.$route.query.token);
    this.loading = true;
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
    this.guestTimezone = this.token.timezone;
    this.guestName = this.token.guests[0].name;
    this.guestEmail = this.token.guests[0].address;
    this.guestPicture = this.token.guests[0].person?.avatar ?? "";
    this.selectedDatetime = new Date(this.token.datetime);
    console.log(this.selectedDatetime);
    this.loading = false;
  }

  async save() {}
}
</script>

<style scoped></style>

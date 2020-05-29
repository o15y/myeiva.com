<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem" v-if="guestName">
      Meeting with {{ guestName }}
    </h1>
    <h1 class="is-size-4" style="margin-bottom: 1rem" v-else>Meeting</h1>
    <table class="table">
      <tbody>
        <tr>
          <td>Status</td>
          <td>
            <span v-if="meetingStatus === 'CONFIRMED'">
              <b-icon icon="check-circle" type="is-success" />
              Confirmed
            </span>
            <span v-else-if="meetingStatus === 'PAST'">
              <b-icon icon="check-circle" type="is-success" />
              Completed
            </span>
            <span v-else>
              <b-icon icon="clock" type="is-warning" />
              Awaiting confirmation
            </span>
          </td>
        </tr>
        <tr v-if="meeting.confirmedTime">
          <td>Confirmed time</td>
          <td>{{ new Date(meeting.confirmedTime).toLocaleString() }}</td>
        </tr>
        <tr>
          <td>Duration</td>
          <td>{{ meeting.duration }} minutes</td>
        </tr>
        <tr>
          <td>Meeting type</td>
          <td>{{ meeting.meetingType }}</td>
        </tr>
        <tr>
          <td>Location</td>
          <td>{{ (meeting.location || {}).value }}</td>
        </tr>
      </tbody>
    </table>
    <h2 class="is-size-5" style="margin: 1rem 0">Guests</h2>
    <div
      v-for="(guest, i) in JSON.parse(meeting.guests || '[]') || []"
      :key="`g${i}`"
    >
      {{ guest }}
      <table class="table">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{{ guest.name }}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{{ guest.address }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.location">
            <td>location</td>
            <td>{{ guest.person.location }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.bio">
            <td>bio</td>
            <td>{{ guest.person.bio }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.timezone">
            <td>timezone</td>
            <td>{{ guest.person.timezone }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.site">
            <td>site</td>
            <td>{{ guest.person.site }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.employment">
            <td>employment</td>
            <td>
              {{ guest.person.employment.title }},
              {{ guest.person.employment.name }}
            </td>
          </tr>
          <tr
            v-if="
              guest.person &&
                guest.person.facebook &&
                guest.person.facebook.handle
            "
          >
            <td>facebook</td>
            <td>{{ guest.person.facebook.handle }}</td>
          </tr>
          <tr
            v-if="
              guest.person && guest.person.github && guest.person.github.handle
            "
          >
            <td>github</td>
            <td>{{ guest.person.github.handle }}</td>
          </tr>
          <tr
            v-if="
              guest.person &&
                guest.person.twitter &&
                guest.person.twitter.handle
            "
          >
            <td>twitter</td>
            <td>{{ guest.person.twitter.handle }}</td>
          </tr>
          <tr
            v-if="
              guest.person &&
                guest.person.linkedin &&
                guest.person.linkedin.handle
            "
          >
            <td>linkedin</td>
            <td>{{ guest.person.linkedin.handle }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 class="is-size-5" style="margin: 1rem 0">Emails</h2>
    <b-table
      :loading="loading"
      :data="meeting.emails"
      :opened-detailed="opened"
      detailed
      detail-key="id"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="emailType" label="Email type">
          <b-tooltip label="Error" v-if="props.row.status === 'ERROR'">
            <b-icon icon="alert" type="is-danger" />
          </b-tooltip>
          <b-tooltip
            label="Processed"
            v-if="
              props.row.emailType === 'INCOMING' &&
                props.row.status === 'SUCCESS'
            "
          >
            <b-icon icon="check-circle" type="is-success" />
          </b-tooltip>
          <b-tooltip
            label="Pending"
            v-if="
              props.row.emailType === 'INCOMING' &&
                props.row.status === 'PENDING'
            "
          >
            <b-icon icon="clock" type="is-warning" />
          </b-tooltip>
          <b-tooltip
            label="Read"
            v-if="
              props.row.emailType === 'OUTGOING' &&
                props.row.status === 'SUCCESS'
            "
          >
            <b-icon icon="check-circle" type="is-info" />
          </b-tooltip>
          <b-tooltip
            label="Sent"
            v-if="
              props.row.emailType === 'OUTGOING' &&
                props.row.status === 'PENDING'
            "
          >
            <b-icon icon="check-circle" type="is-success" />
          </b-tooltip>
          <span>{{ props.row.emailType }}</span>
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Date">
          {{ new Date(props.row.createdAt).toLocaleString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-button
            type="is-primary"
            icon-right="eye"
            @click="toggleOpened(props.row.id)"
          >
            <span>View logs</span>
          </b-button>
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <table class="table">
          <tbody>
            <tr>
              <td>Subject</td>
              <td>{{ props.row.subject }}</td>
            </tr>
            <tr>
              <td>From</td>
              <td>{{ emailify(props.row.from) }}</td>
            </tr>
            <tr>
              <td>To</td>
              <td>{{ emailify(props.row.to) }}</td>
            </tr>
            <tr>
              <td>CC</td>
              <td>{{ emailify(props.row.cc) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="logs" style="margin-top: 1.5rem">
          <div
            v-for="(log, i) in cleanLogs(props.row.logs)"
            :key="`l${i}${props.row.id}`"
          >
            {{ log }}
          </div>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  @Component({
    middleware: "authenticated",
    layout: "teams",
  })
  export default class MeetingSingle extends Vue {
    loading = false;
    meeting: any = { emails: [] };
    opened: number[] = [];

    async mounted() {
      return this.get();
    }

    async get() {
      this.loading = true;
      try {
        const { data } = await this.$axios.get(
          `/organizations/${this.$route.params.username}/meetings/${this.$route.params.id}?include=incoming_emails`
        );
        this.meeting = data;
      } catch (error) {}
      this.loading = false;
    }

    get guestName() {
      return JSON.parse(this.meeting.guests || "[]")
        .map((i: any) => i.name)
        .join(", ");
    }

    toggleOpened(id: number) {
      if (!this.opened.includes(id)) {
        this.opened.push(id);
      } else {
        this.opened = this.opened.filter((i) => i !== id);
      }
    }

    cleanLogs(logs: string) {
      try {
        return JSON.parse(logs || "[]");
      } catch (error) {}
      return [];
    }

    get meetingStatus() {
      try {
        if (this.meeting.confirmedTime) {
          if (
            new Date().getTime() >
            new Date(this.meeting.confirmedTime).getTime()
          ) {
            return "PAST";
          } else {
            return "CONFIRMED";
          }
        } else {
          return "PENDING";
        }
      } catch (error) {}
      return "PENDING";
    }

    emailify(info: string) {
      try {
        const result = JSON.parse(info);
        if (Array.isArray(result)) {
          return (
            result
              .map(
                (i: any) =>
                  `${i.name ? `${i.name} (` : ""}${i.address}${
                    i.name ? ")" : ""
                  }`
              )
              .join(", ") ?? "(empty)"
          );
        }
      } catch (error) {}
      return "(empty)";
    }
  }
</script>

<style lang="scss" scoped>
  .logs {
    max-width: 600px;
    font-size: 90%;
    overflow: auto;
    word-wrap: break-word;
    white-space: nowrap;
    font-family: monospace;
  }
</style>

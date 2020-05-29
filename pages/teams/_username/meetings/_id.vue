<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem" v-if="guestName">
      Meeting with {{ guestName }}
    </h1>
    <h1 class="is-size-4" style="margin-bottom: 1rem" v-else>Meeting</h1>
    <div v-if="meeting.confirmedTime">
      <h2 class="is-size-5" style="margin: 1rem 0">Confirmed time</h2>
      <p>{{ meeting.confirmedTime }}</p>
    </div>
    <div v-else-if="meeting.proposedTimes">
      <h2 class="is-size-5" style="margin: 1rem 0">Proposed times</h2>
      <ul>
        <li
          v-for="(datetime, i) in JSON.parse(meeting.proposedTimes || '[]')"
          :key="`t${i}`"
        >
          <span>{{ new Date(datetime.start).toLocaleString() }}</span>
        </li>
      </ul>
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
        <p v-if="!cleanLogs(props.row.logs).length">
          <em>We couldn't find any logs for this email.</em>
        </p>
        <div v-else class="logs">
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

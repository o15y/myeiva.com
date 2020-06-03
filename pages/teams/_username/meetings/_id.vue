<template>
  <div>
    <b-loading :active="loading" />
    <div style="margin-bottom: 1.5rem; display: flex; margin-left: 1rem">
      <figure
        class="image avatar is-64x64"
        v-if="
          (user && user.details && user.details.profilePicture) ||
            user.details.name
        "
      >
        <img
          class="is-rounded"
          :src="
            user.details.profilePicture ||
              `https://ui-avatars.com/api/?name=${user.details.name}&background=3498db&color=fff`
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
    <h1 class="is-size-4" style="margin-bottom: 1rem" v-if="guestName">
      Meeting with {{ guestName }}
    </h1>
    <h1 class="is-size-4" style="margin-bottom: 1rem" v-else>Meeting</h1>
    <table class="table">
      <tbody>
        <tr>
          <td>Status</td>
          <td>
            <span v-if="meetingStatus === 'CONFIRMED'" class="is-flex">
              <b-icon icon="check-circle" type="is-success" />
              <span style="margin-left: 0.5rem">Confirmed</span>
            </span>
            <span v-else-if="meetingStatus === 'PAST'" class="is-flex">
              <b-icon icon="check-circle" type="is-success" />
              <span style="margin-left: 0.5rem">Completed</span>
            </span>
            <span v-else class="is-flex">
              <b-icon icon="clock" type="is-warning" />
              <span style="margin-left: 0.5rem">Awaiting confirmation</span>
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
          <td>{{ (meeting.location || {}).type }}</td>
        </tr>
        <tr>
          <td>Location</td>
          <td>{{ locationName(meeting.location) }}</td>
        </tr>
      </tbody>
    </table>
    <h2 class="is-size-5" style="margin: 1rem 0">Guests</h2>
    <div
      v-for="(guest, i) in JSON.parse(meeting.guests || '[]') || []"
      :key="`g${i}`"
    >
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
            <td>Location</td>
            <td>{{ guest.person.location }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.bio">
            <td>About</td>
            <td>{{ guest.person.bio }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.timezone">
            <td>Timezone</td>
            <td>{{ guest.person.timezone }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.site">
            <td>Website</td>
            <td>{{ guest.person.site }}</td>
          </tr>
          <tr v-if="guest.person && guest.person.employment">
            <td>Employment</td>
            <td>
              {{ guest.person.employment.title }},
              {{ guest.person.employment.name }}
            </td>
          </tr>
          <tr v-if="guest.person">
            <td>Profiles</td>
            <td>
              <a
                target="_blank"
                :href="
                  `https://www.facebook.com/${guest.person.facebook.handle}`
                "
                v-if="guest.person.facebook && guest.person.facebook.handle"
              >
                <b-icon icon="facebook" />
              </a>
              <a
                target="_blank"
                :href="`https://linkedin.com/${guest.person.linkedin.handle}`"
                v-if="guest.person.linkedin && guest.person.linkedin.handle"
              >
                <b-icon icon="linkedin" />
              </a>
              <a
                target="_blank"
                :href="`https://github.com/${guest.person.github.handle}`"
                v-if="guest.person.github && guest.person.github.handle"
              >
                <b-icon icon="github" />
              </a>
              <a
                target="_blank"
                :href="`https://twitter.com/${guest.person.twitter.handle}`"
                v-if="guest.person.twitter && guest.person.twitter.handle"
              >
                <b-icon icon="twitter" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 v-if="guest.company" class="is-size-6" style="margin: 1rem 0">
        Organization
      </h3>
      <table v-if="guest.company" class="table">
        <tbody>
          <tr v-if="guest.company.name">
            <td>Name</td>
            <td>{{ guest.company.name }}</td>
          </tr>
          <tr v-if="guest.company.description">
            <td>About</td>
            <td>{{ guest.company.description }}</td>
          </tr>
          <tr v-if="guest.company.domain">
            <td>Website</td>
            <td>{{ guest.company.domain }}</td>
          </tr>
          <tr v-if="guest.company.tags">
            <td>Tags</td>
            <td>{{ (guest.company.tags || []).join(", ") }}</td>
          </tr>
          <tr v-if="guest.company.foundedYear">
            <td>Founded</td>
            <td>{{ guest.company.foundedYear }}</td>
          </tr>
          <tr v-if="guest.company.location">
            <td>Location</td>
            <td>{{ guest.company.location }}</td>
          </tr>
          <tr v-if="guest.company.timeZone">
            <td>Timezone</td>
            <td>{{ guest.company.timeZone }}</td>
          </tr>
          <tr>
            <td>Profiles</td>
            <td>
              <a
                target="_blank"
                :href="
                  `https://www.facebook.com/${guest.company.facebook.handle}`
                "
                v-if="guest.company.facebook && guest.company.facebook.handle"
              >
                <b-icon icon="facebook" />
              </a>
              <a
                target="_blank"
                :href="`https://linkedin.com/${guest.company.linkedin.handle}`"
                v-if="guest.company.linkedin && guest.company.linkedin.handle"
              >
                <b-icon icon="linkedin" />
              </a>
              <a
                target="_blank"
                :href="`https://twitter.com/${guest.company.twitter.handle}`"
                v-if="guest.company.twitter && guest.company.twitter.handle"
              >
                <b-icon icon="twitter" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 class="is-size-5" style="margin: 1rem 0">Emails</h2>
    <b-table
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
            icon-left="eye"
            @click="toggleOpened(props.row.id)"
          >
            <span>Details</span>
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
              <td>{{ emailify(props.row.from) || "(empty)" }}</td>
            </tr>
            <tr>
              <td>To</td>
              <td>{{ emailify(props.row.to) || "(empty)" }}</td>
            </tr>
            <tr>
              <td>CC</td>
              <td>{{ emailify(props.row.cc) || "(empty)" }}</td>
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
  import { mapGetters } from "vuex";
  import { User } from "../../../../store/auth";
  @Component({
    middleware: "authenticated",
    layout: "teams",
    computed: mapGetters({
      user: "auth/user",
    }),
  })
  export default class MeetingSingle extends Vue {
    loading = false;
    meeting: any = { emails: [] };
    opened: number[] = [];
    user!: User;

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

    get guestPicture() {
      return JSON.parse(this.meeting.guests || "[]")
        .map((i: any) => i.person?.avatar)
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
            (
              result
                .map(
                  (i: any) =>
                    `${i.name ? `${i.name} (` : ""}${i.address}${
                      i.name ? ")" : ""
                    }`
                )
                .join(", ") ?? ""
            ).trim() ?? "(empty)"
          );
        } else return "(empty)";
      } catch (error) {}
      return "(empty)";
    }

    locationName(location: any) {
      location = location || {};
      if (typeof location === "object" && location.data) {
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
  .avatar img {
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  }
  .avatar {
    margin: 0 -10px;
  }
</style>

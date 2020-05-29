<template>
  <div>
    <h1 class="is-size-4">Scheduling settings</h1>
    <form @submit.prevent="save" style="margin-top: 1rem">
      <b-field label="Scheduling days">
        <div class="block">
          <b-checkbox v-model="schedulingDays" native-value="1">
            Mon
          </b-checkbox>
          <b-checkbox v-model="schedulingDays" native-value="2">
            Tue
          </b-checkbox>
          <b-checkbox v-model="schedulingDays" native-value="3">
            Wed
          </b-checkbox>
          <b-checkbox v-model="schedulingDays" native-value="4">
            Thu
          </b-checkbox>
          <b-checkbox v-model="schedulingDays" native-value="5">
            Fri
          </b-checkbox>
          <b-checkbox v-model="schedulingDays" native-value="6">
            Sat
          </b-checkbox>
          <b-checkbox v-model="schedulingDays" native-value="0">
            Sun
          </b-checkbox>
        </div>
      </b-field>
      <div class="columns">
        <b-field
          label="Scheduling start time"
          class="column"
          style="margin-bottom: 0"
        >
          <b-timepicker
            v-model="schedulingTimeStart"
            placeholder="Click to select..."
            icon="clock"
            :hour-format="'12'"
            :incrementMinutes="15"
            inline
          >
          </b-timepicker>
        </b-field>
        <b-field
          label="Scheduling end time"
          class="column"
          style="margin-bottom: 0"
        >
          <b-timepicker
            v-model="schedulingTimeEnd"
            placeholder="Click to select..."
            icon="clock"
            :hour-format="'12'"
            :incrementMinutes="15"
            inline
          >
          </b-timepicker>
        </b-field>
      </div>
      <b-field
        label="Slot padding"
        message="Time to leave between meetings in minutes"
      >
        <b-input type="text" v-model="team.schedulingPadding" required />
      </b-field>
      <h2 class="is-size-5" style="margin: 1rem 0">
        Calendar connection
      </h2>
      <b-field label="Custom calendar URL">
        <b-input type="text" v-model="team.customCalendarUrl" />
      </b-field>
      <h2 class="is-size-5" style="margin: 1rem 0 ">
        Default appointment details
      </h2>
      <b-field label="Meeting duration">
        <div class="block">
          <b-radio
            v-model="team.schedulingDuration"
            name="schedulingDuration"
            :native-value="15"
          >
            15 minutes
          </b-radio>
          <b-radio
            v-model="team.schedulingDuration"
            name="schedulingDuration"
            :native-value="30"
          >
            30 minutes
          </b-radio>
          <b-radio
            v-model="team.schedulingDuration"
            name="schedulingDuration"
            :native-value="60"
          >
            1 hour
          </b-radio>
        </div>
      </b-field>
      <b-field label="Meeting type">
        <div class="block">
          <b-radio
            v-model="team.schedulingType"
            name="schedulingType"
            native-value="VIDEO_CALL"
          >
            Video call
          </b-radio>
          <b-radio
            v-model="team.schedulingType"
            name="schedulingType"
            native-value="PHONE_CALL"
          >
            Phone call
          </b-radio>
          <b-radio
            v-model="team.schedulingType"
            name="schedulingType"
            native-value="IN_PERSON"
          >
            In-person meeting
          </b-radio>
        </div>
      </b-field>
      <div>
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">
          Update scheduling settings
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
    text: "Which days do you want your assistant to schedule meetings on?",
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
      "If you use a calendar service, you can add a calendar URL here (<a href='#' target='_blank'>Learn how to find your URL</a>)",
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
    text: "Save your settings and click on How to use to continue",
    attachTo: {
      element: "[data-label='How to use']",
      on: "left",
    },
  });

  const twoDigitTime = (time: number) => {
    if (time > 9) return time.toString();
    return `0${time}`;
  };

  @Component({
    middleware: "authenticated",
    layout: "teams",
  })
  export default class TeamsHome extends Vue {
    schedulingDays: string[] = [];
    schedulingTimeStart = new Date();
    schedulingTimeEnd = new Date();

    loading = false;
    loadingSave = false;
    team: any = {};

    async created() {
      this.schedulingTimeStart.setHours(9);
      this.schedulingTimeStart.setMinutes(30);
      this.schedulingTimeEnd.setHours(17);
      this.schedulingTimeEnd.setMinutes(0);
      return this.get();
    }

    async mounted() {
      tour.start();
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
        this.schedulingDays = data.schedulingDays
          .split(",")
          .map((i: string) => i.trim());
        this.schedulingTimeStart = new Date();
        this.schedulingTimeStart.setHours(
          data.schedulingTimeStart.split(":")[0]
        );
        this.schedulingTimeStart.setMinutes(
          data.schedulingTimeStart.split(":")[1]
        );
        this.schedulingTimeEnd = new Date();
        this.schedulingTimeEnd.setHours(data.schedulingTimeEnd.split(":")[0]);
        this.schedulingTimeEnd.setMinutes(data.schedulingTimeEnd.split(":")[1]);
      } catch (error) {}
      this.loading = false;
    }

    async save() {
      this.loadingSave = true;
      try {
        const { data } = await this.$axios.patch(
          `/organizations/${this.$route.params.username}`,
          {
            schedulingDays: this.schedulingDays.join(","),
            schedulingTimeStart: `${twoDigitTime(
              this.schedulingTimeStart.getHours()
            )}:${twoDigitTime(this.schedulingTimeStart.getMinutes())}:00`,
            schedulingTimeEnd: `${twoDigitTime(
              this.schedulingTimeEnd.getHours()
            )}:${twoDigitTime(this.schedulingTimeEnd.getMinutes())}:00`,
          }
        );
        this.team = data.updated;
      } catch (error) {}
      this.loadingSave = false;
    }
  }
</script>

<template>
  <div>
    <div v-if="!loading && !meetings.data.length" class="has-text-centered">
      <img
        alt=""
        src="/illustrations/PlantDoodle.svg"
        style="max-height: 20vh"
      />
      <h2 class="title is-5" style="margin-top: 1rem">
        No meetings yet.
      </h2>
      <p>
        As soon as you ask your assistant to schedule a meeting, it will show up
        here.
      </p>
    </div>
    <div v-for="(meeting, i) in meetings.data" :key="`m${i}${meeting.id}`">
      <nuxt-link
        :to="`/teams/${$route.params.username}/meetings/${meeting.id}`"
        style="display: block"
        class="card"
      >
        <div class="card-content">
          <div class="columns" style="align-items: center">
            <div class="column">
              <div
                class="media"
                v-for="(guest, i) in meeting.guests"
                :key="`g${meeting.id}${i}`"
              >
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img
                      :src="
                        guest.person.avatar ||
                          `https://ui-avatars.com/api/?name=${guest.name}&background=e74c3c&color=fff`
                      "
                      class="is-rounded"
                    />
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4">{{ guest.name }}</p>
                  <p class="subtitle is-6">
                    {{
                      guest.company.name ||
                        guest.person.location ||
                        guest.address
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="column has-text-right">
              <div v-if="meeting.confirmedTime">
                <div>
                  {{ new Date(meeting.confirmedTime).toLocaleString() }}
                </div>
                <div>
                  {{ meeting.duration }} minute {{ meeting.meetingType }}
                </div>
              </div>
              <div v-else>
                <div><em>Awaiting confirmation</em></div>
                <div>
                  {{ meeting.duration }} minute {{ meeting.meetingType }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
    <div class="has-text-centered">
      <b-button
        v-if="meetings.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >
        Load more meetings
      </b-button>
    </div>
    <b-loading :active="loading" />
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
      "<strong>Welcome to EIVA!</strong> Let's get started with using this app. We'll do a quick tour so you know what's what.",
    attachTo: {
      element: ".navbar-item",
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
    text: "When you've set up some meetings, they'll appear here.",
    attachTo: {
      element: ".card",
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
      "On the locations page, you can set your preferred meeting locations, like addresses and video calls. Click on the <strong>Locations</strong> link to continue.",
    attachTo: {
      element: ".menu-list li:nth-child(2)",
      on: "left",
    },
  });

  @Component({
    middleware: "authenticated",
    layout: "teams",
  })
  export default class TeamsHome extends Vue {
    meetings: any = { data: [] };
    loading = false;
    loadingMore = false;

    async mounted() {
      if (!localStorage.getItem("tour-finished")) tour.start();
      return this.get();
    }

    beforeDestroy() {
      tour.complete();
    }

    async get() {
      this.loading = true;
      try {
        const { data } = await this.$axios.get(
          `/organizations/${
            this.$route.params.username
          }/meetings?first=10&orderBy=id:desc${
            this.meetings.data.length
              ? `&after=${this.meetings.data[this.meetings.data.length - 1].id}`
              : ""
          }`
        );
        this.meetings.data.push(
          ...(data.data.map((meeting: any) => {
            meeting.guests = JSON.parse(meeting.guests || []);
            meeting.guests = meeting.guests.map((guest: any) => {
              guest.person = guest.person || {};
              guest.company = guest.company || {};
              return guest;
            });
            meeting.proposedTimes = JSON.parse(meeting.proposedTimes || []);
            return meeting;
          }) || [])
        );
        this.meetings.hasMore = data.hasMore;
        this.meetings = data;
      } catch (error) {}
      this.loading = false;
    }
  }
</script>

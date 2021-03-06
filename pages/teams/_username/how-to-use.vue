<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">How to use</h1>
    <b-message type="is-info" style="margin-bottom: 1rem" has-icon>
      If you're currently doing the research survey, you can
      <strong>copy the email below and go back to the form</strong> to see an
      example email you should send. Once you've sent the email, you can fill
      the rest of the survey.
    </b-message>
    <h2 class="is-size-5">Your assistant's email</h2>
    <p style="margin: 1rem 0">
      <code style="font-size: 110%" class="assistant-email">
        meet-{{ $route.params.username }}@eiva.o15y.com
      </code>
    </p>
    <div><b-button icon-left="content-copy" @click="copy">Copy</b-button></div>
    <h2 class="is-size-5" style="margin-top: 1rem">Schedule an appointment</h2>
    <p style="margin: 1rem 0">
      To ask your assistant to schedule a new appointment with someone:
    </p>
    <ol style="margin: 0 0 1rem 1rem">
      <li>Write an email to whoever you want to set an appointment with</li>
      <li>
        Add your assistant in CC (meet-{{
          $route.params.username
        }}@eiva.o15y.com)
      </li>
      <li>Write in natural language, like the following example.</li>
    </ol>
    <div class="card card-content" style="margin-bottom: 1rem">
      <div>
        <strong>To: </strong> Anand Chowdhary (anandchowdhary@gmail.com)
      </div>
      <div>
        <strong>CC: </strong> Your Assistant (meet-{{
          $route.params.username
        }}@eiva.o15y.com)
      </div>
      <div><strong>Subject: </strong> Appointment</div>
      <div><strong>Message: </strong></div>
      <div>
        Dear Anand,<br />
        Let's catch up sometime next week!<br />
        I've looped in my assistant, who can set up an appointment.
      </div>
    </div>
    <p>
      The above is just an example email, but you're free to experiment with
      your assistant.
    </p>
    <p style="margin-top: 1rem">
      After you send the email, your assistant will find times and send an email
      to your recipient. Once they have confirmed a time, you'll get an email.
    </p>
    <p style="margin-top: 1rem">
      <strong>
        Now, head to your email and send an email with CC to your assistant.
      </strong>
    </p>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import Shepherd from "shepherd.js";
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark",
      scrollTo: true,
    },
  });
  tour.addStep({
    text:
      "This is your assistant's email. You can use it to send emails to your assistant. Go back to the survey form to see how.",
    attachTo: {
      element: ".card code",
      on: "bottom",
    },
    buttons: [
      {
        text: "Complete tour",
        action: () => {
          localStorage.setItem("tour-finished", "1");
          tour.complete();
        },
      },
    ],
  });

  @Component({
    middleware: "authenticated",
    layout: "teams",
  })
  export default class TeamsHowToUse extends Vue {
    mounted() {
      if (!localStorage.getItem("tour-finished")) tour.start();
    }

    copy() {
      const emailNode = document.querySelector(".assistant-email");
      const range = document.createRange();
      if (!emailNode) return;
      range.selectNode(emailNode);
      const selection = window.getSelection();
      if (selection) selection.addRange(range);
      try {
        const successful = document.execCommand("copy");
        const msg = successful ? "successful" : "unsuccessful";
      } catch (error) {}
      if (selection) selection.removeAllRanges();
      this.$buefy.snackbar.open({ message: "Copied", position: "is-bottom" });
    }
  }
</script>

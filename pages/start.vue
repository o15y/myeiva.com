<template>
  <main>
    <img alt="" src="/illustrations/Home.svg" />
    <h1>Get your own virtual assistant.</h1>
    <p>Schedule appointments, send emails, and more.</p>
    <nuxt-link class="button is-primary is-large" to="/auth/register">
      Create your free account &rarr;
    </nuxt-link>
    <p>
      This service is part of Anand Chowdhary's graduation project for Creative
      Technology BSc. Please make sure you
      <a href="https://forms.gle/T1j7VHTJN51zKJPe8"
        >fill the consent form and survey</a
      >
      before creating an account.
    </p>
  </main>
</template>

<style lang="scss" scoped>
  main {
    text-align: center;
    margin: 10vh 0;
  }
  img {
    max-width: 50vh;
    margin-bottom: 2rem;
  }
  h1 {
    font-size: 200%;
  }
  p {
    font-size: 125%;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
  p:last-child {
    font-size: 100%;
    margin: 2rem auto 0 auto;
    max-width: 500px;
  }
</style>

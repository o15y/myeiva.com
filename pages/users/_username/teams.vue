<template>
  <div>
    <h1 class="is-size-4">Assistants</h1>
    <b-table
      :loading="loading"
      :empty="!teams.data.length && !loading"
      :data="teams.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
      hoverable
    >
      <template slot-scope="props">
        <b-table-column
          sortable
          field="organization.name"
          label="Assistant name"
        >
          {{ props.row.organization.assistantName }}
        </b-table-column>
        <b-table-column sortable field="role" label="Role">
          {{ props.row.role }}
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Joined">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-button
            type="is-primary"
            tag="nuxt-link"
            :to="`/teams/${props.row.organization.username}`"
          >
            Go to assistant
          </b-button>
          <b-tooltip label="Leave team">
            <b-button
              type="is-danger"
              icon-right="logout"
              @click="
                deleteMembership(props.row.id, props.row.organization.name)
              "
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="teams.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >
        Load more assistants
      </b-button>
    </div>
    <h2 class="is-size-5" style="margin-top: 1rem">Create another assistant</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Assistant name">
        <b-input type="team" v-model="newTeam" required />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingAdd">
        Create assistant
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from "vue-property-decorator";

  @Component({
    middleware: "authenticated",
    layout: "users",
  })
  export default class UsersTeams extends Vue {
    newTeam = "";
    loading = false;
    loadingAdd = false;
    teams: any = { data: [] };

    async created() {
      return this.get();
    }

    async get() {
      this.loading = true;
      try {
        const { data } = await this.$axios.get(
          `/users/${this.$route.params.username}/memberships?first=10${
            this.teams.data.length
              ? `&after=${this.teams.data[this.teams.data.length - 1].id}`
              : ""
          }`
        );
        this.teams.data.push(...(data.data || []));
        this.teams.hasMore = data.hasMore;
      } catch (error) {}
      this.loading = false;
    }

    async add() {
      this.loadingAdd = true;
      try {
        const { data } = await this.$axios.put(`/organizations`, {
          assistantName: this.newTeam,
        });
        this.newTeam = "";
      } catch (error) {}
      this.loadingAdd = false;
      return this.get();
    }

    async deleteMembership(id: number, team: string) {
      this.$buefy.dialog.confirm({
        title: "Leaving team",
        message: `Are you sure you want to leave the team <strong>${team}</strong>? This action is not reversible, and you'll have to request to join this team again if you change your mind.`,
        confirmText: "Yes, leave team",
        cancelText: "No, don't leave",
        type: "is-danger",
        hasIcon: true,
        trapFocus: true,
        onConfirm: async () => {
          this.loading = true;
          try {
            await this.$axios.delete(
              `/users/${this.$route.params.username}/memberships/${id}`
            );
          } catch (error) {}
          this.teams = { data: [] };
          return this.get();
        },
      });
    }
  }
</script>

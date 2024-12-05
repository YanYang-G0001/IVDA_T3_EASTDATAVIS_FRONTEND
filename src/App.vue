<template>
  <v-app>
    <v-app-bar app class="custom-app-bar">
      <h2>   Diabetes Analysis</h2>
    </v-app-bar>
    <v-main>
      <ConfigurationPanel/>
    </v-main>
  </v-app>
</template>


<script>
import ConfigurationPanel from './components/ConfigurationPanel.vue'

export default {
  name: 'App',

  components: {
    ConfigurationPanel ,
  },

  data: () => ({
    //
  }),
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  /* disable scrolling */

  html {
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none; /* For Internet Explorer and Edge */
  }

  html::-webkit-scrollbar {
    width: 0px; /* For Chrome, Safari, and Opera */
  }

  .v-app-bar.custom-app-bar { /* add v-app-bar. can improve prioity*/
    background-color: #1F4529;
    color: whitesmoke;
  }
}
</style>

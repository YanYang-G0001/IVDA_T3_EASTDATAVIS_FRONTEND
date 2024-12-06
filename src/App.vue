<template>
  <v-app>
    <v-app-bar app class="custom-app-bar">
      <h2 style="font-size: 34px;">Diabetes Analysis</h2>
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

  .v-app-bar.custom-app-bar {
    background-color: #163919;
    color: #f8f8f8;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 10px 20px;
    border-bottom: 6px solid #FFB057;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

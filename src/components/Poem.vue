<template>
  <div>
    <v-container fluid>
      <v-row>
          <v-row align="center" justify="center" class="mt-1 mb-0">
            <h3>Poem about company
              <span :style="{ backgroundColor: 'Yellow'}">
                  {{this.company_name}}
              </span>
            </h3>
          </v-row>
          <div style="height: 90vh">
            <div id='myPoem' style="height: inherit">
              {{ poem }}
            </div>
          </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: "PoemLLM",
  // defined in parent component, no need to import, already be rendered in the template
  props: ["selectedCompany"],
  data() {
    return {
      poem: '',
    };
  },
  mounted() {
    this.fetchPoem()
  },
  methods: {
    async fetchPoem() {
      try {
        const response = await axios.get(`http://localhost:5000/llm/groq/poem/${this.$props.selectedCompany}`);
        this.poem = response.data.poem;
        this.company_name=response.data.name;
        console.log("poem" + this.poem)
      } catch (error) {
        console.error("Error fetching the poem:", error);
      }
    }
  },
  watch: {
    selectedCompany() {
      this.poem = ''
      this.fetchPoem();
      }
    }
}
</script>

<template>
  <div>
    <v-container fluid>
      <v-row>
        <div style="font-style: italic; text-transform: uppercase">
            keyword: {{this.company_name}}
        </div>
          <div style="height: 100%">
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

<template>
  <div>
    <v-container fluid>
      <v-row>
        <div style="font-style: italic; text-transform: uppercase">
        keyword: {{this.company_name}}, {{this.category}} industry
        </div>
        <div style="height: 100%">
          <div id='myEvaluation' style="height: inherit">
            {{ evaluation }}
          </div>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: "EvaluationLLM",
  // defined in parent component, no need to import, already be rendered in the template
  props: ["selectedCompany"],
  data() {
    return {
      evaluation: '',
    };
  },
  mounted() {
    this.fetchEvaluation()
  },
  methods: {
    async fetchEvaluation() {
      try {
        const response = await axios.get(`http://localhost:5000/llm/groq/evaluation/${this.$props.selectedCompany}`);
        this.evaluation = response.data.evaluation;
        this.company_name=response.data.name;
        this.category=response.data.category;
      } catch (error) {
        console.error("Error fetching the poem:", error);
      }
    }
  },
  watch: {
    selectedCompany() {
      this.evaluation = ''
      this.fetchEvaluation();
    }
  }
}
</script>

<template>
  <v-row align="center" justify="center" class="mt-1 mb-0" style="padding: 2px; margin: 0;">
    <div>
      <h2>Individual Diabetes Risk Prediction</h2>
      <div class="appendix">The results are for reference only. If you experience any discomfort, please consult a doctor in person.</div>
    </div>
  </v-row>
  <v-container fluid style="padding: 0;">

    <v-data-table theme="dark"
        :headers="headers"
        :items="rows"
        items-per-page="5"
    >
      <template v-slot:[`item.name`]="{ item }">
        <v-text-field
            v-model="item.name"
            dense
        />
      </template>

      <template v-slot:[`item.age`]="{ item }">
        <v-text-field
            v-model="item.age"
            dense
        />
      </template>

      <template v-slot:[`item.gender`]="{ item }">
        <v-select
            v-model="item.gender"
            :items="gender"
            dense
        />
      </template>

      <template v-slot:[`item.polyuria`]="{ item }">
        <v-select
            v-model="item.polyuria"
            :items="categories"
            dense
        />
      </template>

      <template v-slot:[`item.polydipsia`]="{ item }">
        <v-select
            v-model="item.polydipsia"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.sudden_weight_loss`]="{ item }">
        <v-select
            v-model="item.sudden_weight_loss"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.weakness`]="{ item }">
        <v-select
            v-model="item.weakness"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.polyphagia`]="{ item }">
        <v-select
            v-model="item.polyphagia"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.genital_thrush`]="{ item }">
        <v-select
            v-model="item.genital_thrush"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.visual_blurring`]="{ item }">
        <v-select
            v-model="item.visual_blurring"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.itching`]="{ item }">
        <v-select
            v-model="item.itching"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.irritability`]="{ item }">
        <v-select
            v-model="item.irritability"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.delayed_healing`]="{ item }">
        <v-select
            v-model="item.delayed_healing"
            :items="categories"
            dense
        />
      </template>

      <template v-slot:[`item.partial_paresis`]="{ item }">
        <v-select
            v-model="item.partial_paresis"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.muscle_stiffness`]="{ item }">
        <v-select
            v-model="item.muscle_stiffness"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.alopecia`]="{ item }">
        <v-select
            v-model="item.alopecia"
            :items="categories"
            dense
        />
      </template>
      <template v-slot:[`item.obesity`]="{ item }">
        <v-select
            v-model="item.obesity"
            :items="categories"
            dense
        />
      </template>

      <!-- Prediction Result Column -->
      <template v-slot:[`item.prediction`]="{ item }">
        <v-text-field
            v-model="item.prediction"
            :value="item.prediction"
            label="Prediction"
            dense
            readonly
        />
      </template>


    </v-data-table>
    <v-row>
      <!-- Add Row Button -->
      <v-btn @click="addRow" color="grey" class="mb-4">+ Add Row</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      itemsPerPage: 10, // Controls the number of items per page
      categories: ['Yes', 'No'], // List of categories for dropdown
      gender:['Male','Female'],
      rows: [
        {
          name: '',
          age: '25',
          gender: 'Male',
          polyuria: 'Yes',
          polydipsia: 'Yes',
          sudden_weight_loss: 'Yes',
          weakness: 'Yes',
          polyphagia: 'Yes',
          genital_thrush: 'Yes',
          visual_blurring: 'Yes',
          itching: 'Yes',
          irritability: 'Yes',
          delayed_healing: 'Yes',
          partial_paresis: 'Yes',
          muscle_stiffness: 'Yes',
          alopecia: 'Yes',
          obesity: 'Yes',
          prediction: '' // Empty prediction
        },
        {
          name: '',
          age: '',
          gender: '',
          polyuria: '',
          polydipsia: '',
          sudden_weight_loss: '',
          weakness: '',
          polyphagia: '',
          genital_thrush: '',
          visual_blurring: '',
          itching: '',
          irritability: '',
          delayed_healing: '',
          partial_paresis: '',
          muscle_stiffness: '',
          alopecia: '',
          obesity: '',
          prediction: '' // Empty prediction
        }
      ],
      headers: [
        { title: 'Name', align: 'start', key: 'name' },
        { title: 'Age', key:'age',value: 'age', description: '1. 20-65'},
        { title: 'Gender', value: 'gender', description: '1. Male, 2. Female' },
        { title: 'Polyuria', value: 'polyuria', description: '1. Yes, 2. No.' },
        { title: 'Polydipsia', value: 'polydipsia', description: '1. Yes, 2. No.' },
        { title: 'Sudden weight loss', value: 'sudden_weight_loss', description: '1. Yes, 2. No.' },
        { title: 'Weakness', value: 'weakness', description: '1. Yes, 2. No.' },
        { title: 'Polyphagia', value: 'polyphagia', description: '1. Yes, 2. No.' },
        { title: 'Genital thrush', value: 'genital_thrush', description: '1. Yes, 2. No.' },
        { title: 'Visual blurring', value: 'visual_blurring', description: '1. Yes, 2. No.' },
        { title: 'Itching', value: 'itching', description: '1. Yes, 2. No.' },
        { title: 'Irritability', value: 'irritability', description: '1. Yes, 2. No.' },
        { title: 'Delayed healing', value: 'delayed_healing', description: '1. Yes, 2. No.' },
        { title: 'Partial paresis', value: 'partial_paresis', description: '1. Yes, 2. No.' },
        { title: 'Muscle stiffness', value: 'muscle_stiffness', description: '1. Yes, 2. No.' },
        { title: 'Alopecia', value: 'alopecia', description: '1. Yes, 2. No.' },
        { title: 'Obesity', value: 'obesity', description: '1. Yes, 2. No.' },
        { title: 'Prediction', value: 'prediction', align: 'center',key:'prediction',description: '1. Positive, 2. Negative.' },
      ],
    };
  },
  watch: {
    // Watch for changes in rows and call an API or method to predict the results
    rows: {
      handler(newRows) {
        newRows.forEach((row) => {
          // Check if all required fields have values
          if (this.areAllFieldsFilled(row)) {
            this.predict(row); // Only call predict if all fields are filled
          } else {
            row.prediction = ''; // Clear prediction if any field is empty
          }
        });
      },
      deep: true,
    },
  },
  methods: {
    // Method to add a new row to the table
    addRow() {
      // Push a new empty row into the rows array
      this.rows.push({
        name: '',
        age: '',
        gender: '',
        polyuria: '',
        polydipsia: '',
        sudden_weight_loss: '',
        weakness: '',
        polyphagia: '',
        genital_thrush: '',
        visual_blurring: '',
        itching: '',
        irritability: '',
        delayed_healing: '',
        partial_paresis: '',
        muscle_stiffness: '',
        alopecia: '',
        obesity: '',
        prediction: '' // Empty prediction

      });
    },
    // Check if all the necessary fields are filled in
    areAllFieldsFilled(row) {
      const requiredFields = [
        'name', 'age', 'gender', 'polyuria', 'polydipsia', 'sudden_weight_loss',
        'weakness', 'polyphagia', 'genital_thrush', 'visual_blurring', 'itching',
        'irritability', 'delayed_healing', 'partial_paresis', 'muscle_stiffness',
        'alopecia', 'obesity'
      ];

      // Check if every required field is filled
      return requiredFields.every(field => row[field] !== '');
    },

    // Prediction method that returns a value based on the row data
    predict(row) {
      const uniqueId = Date.now();
      if (row.name && row.age && row.gender) {
        // Prepare the data to send in the request body
        const requestData = {
          id: uniqueId,
          name: row.name,
          age: row.age,
          gender: row.gender,
          polyuria: row.polyuria,
          polydipsia: row.polydipsia,
          sudden_weight_loss: row.sudden_weight_loss,
          weakness: row.weakness,
          polyphagia: row.polyphagia,
          genital_thrush: row.genital_thrush,
          visual_blurring: row.visual_blurring,
          itching: row.itching,
          irritability: row.irritability,
          delayed_healing: row.delayed_healing,
          partial_paresis: row.partial_paresis,
          muscle_stiffness: row.muscle_stiffness,
          alopecia: row.alopecia,
          obesity: row.obesity
        };

        // Send a POST request to the Flask API
        fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // Set the content type to JSON
          },
          body: JSON.stringify(requestData)  // Convert the data object to JSON
        })
            .then(response => response.json())  // Parse the response as JSON
            .then(data => {
              // Handle the prediction result
              if (data.prediction) {
                row.prediction = data.prediction;  // Update the row with the prediction
              } else {
                row.prediction = 'No prediction available';
              }
            })
            .catch(error => {
              console.error('Error during prediction:', error);
              row.prediction = 'Error occurred during prediction';
            });
      } else {
        row.prediction = 'Invalid input data';
      }
    }
  }
};
</script>

<style scoped>
/* You can add custom styling for the table or the text fields here */
</style>

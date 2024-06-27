const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();  // Load .env file

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));

const privateAppToken = process.env.PRIVATE_APP_TOKEN;  // Get the access token from the environment variables

// Function to create custom object schema
const createCustomObjectSchema = async () => {
  const endpoint = 'https://api.hubapi.com/crm/v3/schemas';
  const headers = {
    Authorization: `Bearer ${privateAppToken}`,
    'Content-Type': 'application/json'
  };
  const data = {
    "name": "cars",
    "description": "Cars keeps track of cars currently or previously held in our inventory.",
    "labels": {
      "singular": "Car",
      "plural": "Cars"
    },
    "primaryDisplayProperty": "model",
    "secondaryDisplayProperties": [
      "make"
    ],
    "searchableProperties": [
      "year",
      "make",
      "vin",
      "model"
    ],
    "requiredProperties": [
      "year",
      "make",
      "vin",
      "model"
    ],
    "properties": [
      {
        "name": "condition",
        "label": "Condition",
        "type": "enumeration",
        "fieldType": "select",
        "options": [
          {
            "label": "New",
            "value": "new"
          },
          {
            "label": "Used",
            "value": "used"
          }
        ]
      },
      {
        "name": "date_received",
        "label": "Date received",
        "type": "date",
        "fieldType": "date"
      },
      {
        "name": "year",
        "label": "Year",
        "type": "number",
        "fieldType": "number"
      },
      {
        "name": "make",
        "label": "Make",
        "type": "string",
        "fieldType": "text"
      },
      {
        "name": "model",
        "label": "Model",
        "type": "string",
        "fieldType": "text"
      },
      {
        "name": "vin",
        "label": "VIN",
        "type": "string",
        "hasUniqueValue": true,
        "fieldType": "text"
      },
      {
        "name": "color",
        "label": "Color",
        "type": "string",
        "fieldType": "text"
      },
      {
        "name": "mileage",
        "label": "Mileage",
        "type": "number",
        "fieldType": "number"
      },
      {
        "name": "price",
        "label": "Price",
        "type": "number",
        "fieldType": "number"
      },
      {
        "name": "notes",
        "label": "Notes",
        "type": "string",
        "fieldType": "text"
      }
    ],
    "associatedObjects": [
      "CONTACT"
    ]
  };

  try {
    const response = await axios.post(endpoint, data, { headers });
    console.log('Custom Object Schema Created:', response.data);
  } catch (error) {
    console.error('Error creating custom object schema:', error.response ? error.response.data : error.message);
  }
};

// Run the function to create the custom object schema
createCustomObjectSchema();

app.get('/home-cars', async (req, res) => {
  const carsEndpoint = 'https://api.hubapi.com/crm/v3/objects/cars?properties=year,model,vin';
  const headers = {
    Authorization: `Bearer ${privateAppToken}`,
    'Content-Type': 'application/json'
  }
  const params = {
    properties: ['year', 'model', 'vin'] // Add the property names you want here
  }
  try {
    const response = await axios.get(carsEndpoint, { headers, params });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    const pets = response.data.results;
    console.log('Car data:', JSON.stringify(pets, null, 2));
    res.render('home', { pets: pets });
  } catch (error) {
    console.error(error);
  }
})

app.get('/update-cars', (req, res) => {
  try {
    res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' }); // Render the updates.pug template
  } catch (error) {
    console.error(error);
  }
});

app.post('/update-cars', async (req, res) => {
  const carsEndpoint = 'https://api.hubapi.com/crm/v3/objects/cars';
  const headers = {
    Authorization: `Bearer ${privateAppToken}`,
    'Content-Type': 'application/json'
  }
  const data = {
    properties: {
      year: req.body.year,
      model: req.body.model,
      vin: req.body.vin
    }
  }
  try {
    const response = await axios.post(carsEndpoint, data, { headers });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    res.redirect('/home-cars'); // Redirects to home page
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));

const mongoose = require('mongoose');
const Product = require('../models/product'); // Adjust the path if needed
const products = require('./products.json'); // Load the product data from JSON

// Remove the `_id` field from each product
products.forEach(product => delete product._id);

// Connect to MongoDB (use your local or Atlas connection string)
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Insert products into the database
Product.insertMany(products)
  .then(() => {
    console.log('Products added successfully!');
    mongoose.connection.close(); // Close connection after seeding
  })
  .catch(err => {
    console.error('Error inserting products:', err);
  });

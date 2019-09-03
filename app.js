const express = require('express');
const app = express();
const Restaurant = require('./models/restaurant.model');
const restaurant_data = require('./rest-data');
const mongoose = require('mongoose');

//const Restaurants = new Restaurant();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/restaurants');

mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

app.get('/savedata', (req, res) => {
  if (req.query) {
    console.log(req.query);
    Restaurant.collection.insert(restaurant_data, (err, data) => {
      if (err) throw err;
      res.status(200).send({
        message: "data entered successfully"
      })
    })
  }
});

app.get('/', (req, res) => {
  res.send("listening for requests");
});

app.get('/search', (req, res) => {
  let long = parseFloat(req.query.long);
  let lat = parseFloat(req.query.lat);

  Restaurant.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [long, lat]
        },
        distanceField: "dist.calculated",
        $maxDistance: 2000000,
        spherical: true
      }
    },
    {
      $group: {
        _id: null, objectsLoaded: { $sum: 1 }, maxDistance:
          { $max: "$dist.calculated" }, avgDistance: { $avg: "$dist.calculated" }
      }
    }
  ], (err, data) => {
    if (err) throw err;
    return res.send(data);
  })
});


app.listen(4500, () => {
  console.log("listening to port 4500");
})
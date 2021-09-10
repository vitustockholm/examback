// Routes
// GET ALL models, without PMV       -   '/models'
// POST add new model                -   '/models'
// GET all models/numbers            -   '/modelscount'
// GET all vehicles/Price+PVM        -    '/vehicles'   forEach() filter() toObject()
// POST new vehicle                  -    '/vehicles'
// GET vehicles sorted LT/LV/EE      -    '/vehicles/:country

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

import Model from './models/modelModel.js';
import Vehicle from './models/vechileModel.js';

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log('Connected to MongoDB'.blue.underline.bold);

    // Starting server
    app.listen(process.env.PORT, () =>
      console.log(
        `Server is running on ${process.env.PORT}...`.yellow.underline.bold
      )
    );
  });

//
// Logic
let newVehicles = [];

// Routes
// GET ALL models, without PMV
app.get('/models', async (req, res) => {
  let models = await Model.find({});

  res.json(models);
});

// POST add new model
app.post('/models', async (req, res) => {
  let model = req.body;

  const modelExist = await Model.find({ name: model.name }).then((result) => {
    return result;
  });

  if (modelExist.length) {
    res.json({
      message: 'Model already existing in Mongo DB',
    });
  } else {
    const newModel = new Model(model);

    newModel.save().then((result) => {
      res.json({
        message: 'Great Success, added successfully to DB!',
      });
    });
  }
});

// GET all models AND number of vehicles
app.get('/modelscount', async (req, res) => {
  let models = await Model.find({});
  let vehicle = await Vehicle.find({});

  let modelsWithVehicles = models.reduce((total, current) => {
    let matchFinder = vehicle.filter(
      (item) => item.model_id.toString() === current._id.toString()
    );

    total.push({ ...current.toObject(), count: matchFinder.length });
    return total;
  }, []);

  res.json(modelsWithVehicles);
});

// POST add new vehicle
app.post('/vehicles', async (req, res) => {
  let vehicle = req.body;

  const vehicleExist = await Vehicle.find({
    number_plate: vehicle.number_plate,
  });

  if (vehicleExist.length) {
    res.json({
      message: 'Vehicle already exist with these plate numbers!',
    });
  } else {
    const newVehicle = new Vehicle(vehicle);

    newVehicle.save().then((result) => {
      res.json({
        message: 'Great Success, successlfully added!',
      });
    });
  }
});

// GET only vehicles from LT/LV/EE
app.get('/vehicles/:country', async (req, res) => {
  let country = req.params.country;

  switch (country) {
    case 'lietuva':
      country = 'LT';
      break;
    case 'estija':
      country = 'EE';
      break;
    case 'latvija':
      country = 'LV';
      break;
    default:
      country = '';
  }
  let model = await Model.find({});
  let vehicles = await Vehicle.find({ country_location: country });

  vehicles.forEach((vechiles) => {
    const result = model.filter((modelItem) => {
      return modelItem._id.toString() === vechiles.model_id.toString();
    });

    for (let x of result) {
      const newObject = {
        ...vechiles.toObject(),
        model_id: x.name,
        hour_price: +(x.hour_price + (x.hour_price * 21) / 100).toFixed(2),
      };
      newVehicles.push(newObject);
    }
  });

  res.json(newVehicles);
  newVehicles = [];
});
//  GET all vehicles/Price+PVM
app.get('/vehicles', async (req, res) => {
  let model = await Model.find({});
  let vehicles = await Vehicle.find({});

  vehicles.forEach((vechiles) => {
    const result = model.filter((modelItem) => {
      return modelItem._id.toString() === vechiles.model_id.toString();
    });

    for (let objects of result) {
      const newObject = {
        ...vechiles.toObject(),
        model_id: objects.name,
        hour_price: +(
          objects.hour_price +
          (objects.hour_price * 21) / 100
        ).toFixed(2),
      };
      newVehicles.push(newObject);
    }
  });

  res.json(newVehicles);
  newVehicles = [];
});

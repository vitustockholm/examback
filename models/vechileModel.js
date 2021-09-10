import mongoose from 'mongoose';
const { Schema } = mongoose;

const vehiclesSchema = new Schema({
  model_id: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
  },

  number_plate: {
    type: String,
    required: true,
  },

  country_location: {
    type: String,
    required: true,
  },
});

const Vehicle = mongoose.model('vehicle', vehiclesSchema);
export default Vehicle;

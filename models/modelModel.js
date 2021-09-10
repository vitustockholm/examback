import mongoose from 'mongoose';
const { Schema } = mongoose;

const modelsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  hour_price: {
    type: Number,
    required: true,
  },
});

const Model = mongoose.model('model', modelsSchema);
export default Model;

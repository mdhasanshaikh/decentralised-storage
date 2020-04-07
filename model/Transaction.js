const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  acc_type: {
    type: String,
    required: true,
  },
  register_date: {
    type: String,
    default: Date.now,
  },
});

module.exports = transaction = mongoose.model("transaction", TransactionSchema);
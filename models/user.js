const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    epost: { type: String, required: true , unique: true},
    passord: { type: String, required: true },
  }, { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

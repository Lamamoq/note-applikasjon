const { default: mongoose } = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    epost: { type: String, required: true },
    notatTittel: { type: String, required: true },
    notatTekst: { type: String, required: true }
  }, { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);

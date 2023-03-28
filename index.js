// Backend til notater appen
const express = require("express");
const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");
// Importerer notatene og brukeren
const notes = require("./models/notes");
const user = require("./models/user");
const app = express();
//app.use er brukt her for å hente data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

// Koble til mongodb databasen
const url =
"mongodb+srv://lamaalmqayyad:SIIkyhxkdtYwWyAO@noteapp.ii7vlrs.mongodb.net/?retryWrites=true&w=majority";
async function kobleTilDatabase() {
  try {
    await mongoose.connect(url);
    console.log("Koblet til databasen");
  } catch (error) {
    console.error(error);
  }
}
kobleTilDatabase();

app.use(express.static('Pages'));

app.get("/login", (req, res) => {
  res.sendFile("pages/login.html", { root: __dirname });
});

app.get("/signup", (req, res) => {
  res.sendFile("pages/signup.html", { root: __dirname });
});

// For å hente brukerens notater - API
app.post("/getnotes", async (req, res) => {
  const note = await notes.find({ epost: req.body.epost });
  res.json({ notes: note });
});

// login
app.post("/login", async (req, res) => {
  // sjekk hvis brukeren er allerede registrert
  let sjekkBruker = await user.findOne({
    epost: req.body.epost,
  });

  if (!sjekkBruker) {
    res.json({ message: "Kunne ikke finne brukeren" });
  } else {
    if (sjekkBruker.passord === req.body.passord) {
      res.json({ message: "Logget inn", user: sjekkBruker });
    } else {
      res.json({ message: "Passordet er feil" });
    }
  }
});

// signup
app.post("/signup", async (req, res) => {
  // lager data i mongoDB
  await user.create(req.body);
  res.json({ message: "Registreringen var vellykket" });
});
 
app.post("/addnote", async (req, res) => {
  await notes.create(req.body);
  res.json({ message: "En ny notat opprettet" }); 
});
 
// Slett notat API
app.delete("/notes/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const result = await notes.deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount == 1) {
      res.status(200).json({ message: "Notatet ble slettet" });
    } else {
      res.status(404).json({ message: "Notatet ble ikke funnet" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Noe gikk galt" });
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

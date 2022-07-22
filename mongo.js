require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then((result) => {
    if (process.argv.length > 3) {
      console.log("connected");
      const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
      });

      console.log(
        `added ${process.argv[2]} number ${process.argv[3]} to phonebook`
      );

      return person.save();
    }
  })
  .then(() => {
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));

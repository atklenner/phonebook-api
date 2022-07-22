require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/people");
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :post")
);
morgan.token("post", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else return "";
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (name && number) {
    const person = new Person({ name, number });
    person.save().then((newPerson) => {
      res.json(newPerson);
    });
  } else {
    res.status(400).json({ error: "name or number missing" });
  }
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

app.get("/api/info", (req, res) => {
  Person.count().then((count) => {
    let info = { number: count, date: Date() };
    res.json(info);
  });
});

app.listen(PORT, () => console.log("Running"));

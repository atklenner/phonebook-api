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
  let alreadyExists = persons.find((person) => person.name === name);
  if (alreadyExists) {
    res.status(400).send({ error: "name must be unique" });
  } else if (name && number) {
    let id = Math.floor(Math.random() * 10000 + 1);
    let newNum = { id, name, number };
    persons.push(newNum);
    res.status(201).json(newNum);
  } else {
    res.status(400).json({ error: "name or number missing" });
  }
});

app.get("/api/persons/:id", (req, res) => {
  Person.find({ id: req.params.id }).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  console.log(persons.filter((person) => person.id !== +req.params.id));
  persons = persons.filter((person) => person.id !== +req.params.id);
  res.status(204).end();
});

app.get("/api/info", (req, res) => {
  Person.count().then((count) => {
    let info = { number: count, date: Date() };
    res.json(info);
  });
});

app.listen(PORT, () => console.log("Running"));

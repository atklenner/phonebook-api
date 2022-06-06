const express = require("express");
const app = express();
const PORT = 3001;

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  { id: 5 },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  res.json(persons.filter((person) => person.id === +req.params.id));
});

app.get("/info", (req, res) => {
  let string = `Phonebook has info for ${persons.length} people
  ${Date()}`;
  res.send(string);
});

app.listen(process.env.PORT || PORT, () => console.log("Running"));

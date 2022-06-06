const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 3001;

let persons = [
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
];

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :post")
);
morgan.token("post", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else return "";
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
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
  res.json(persons.filter((person) => person.id === +req.params.id));
});

app.delete("/api/persons/:id", (req, res) => {
  console.log(persons.filter((person) => person.id !== +req.params.id));
  persons = persons.filter((person) => person.id !== +req.params.id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  let info = { number: persons.length, date: Date() };
  res.json(info);
});

app.listen(process.env.PORT || PORT, () => console.log("Running"));

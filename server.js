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

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  console.log(error.name);
  if ((error.name = "CastError")) {
    return res.status(400).send({ error: error.message });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

morgan.token("post", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else return "";
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((people) => {
      res.json(people);
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  if (name && number) {
    const person = new Person({ name, number });
    person
      .save()
      .then((newPerson) => {
        res.json(newPerson);
      })
      .catch((err) => next(err));
  }
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const { number } = req.body;
  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/info", (req, res) => {
  Person.count().then((count) => {
    let info = { number: count, date: Date() };
    res.json(info);
  });
});

app.use(errorHandler);

app.listen(PORT, () => console.log("Running"));

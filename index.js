const express = require("express");
const Joi = require("joi");
const app = express();

app.use(express.json());
const courses = [
  {
    id: 1,
    name: "course1",
  },
  {
    id: 2,
    name: "course2",
  },
  {
    id: 3,
    name: "course3",
  },
];

app.get("/", (req, res) => {
  res.send("Hello Ahmad");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// /api/courses/1
// app.get("/api/courses/:id", (req, res) => {
//   res.send(req.params.id);
// });

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The given id is not find");
  res.send(course);
});

app.get("/api/courses/:year/:month", (req, res) => {
  res.send(req.params);
});

app.get("/api/courses/:year/:month?sortBy=name", (req, res) => {
  res.send(req.params);
});

// PORT
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // if(!req.body.name || req.body.length > 3){
  //     res.status(400).send('Name is required and name should be 3 character')
  //     return;
  // }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("The given id is not found");
  }

  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("The given id is not found");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course)
});

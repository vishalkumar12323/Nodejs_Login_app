require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const connectDB = require("../db/dataBaseConnections");
const Contact = require("../model/contactSchema");

const Port = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const template_Path = path.join(__dirname, "./templates/views");
const partials_Path = path.join(__dirname, "./templates/partials");
app.set("view engine", "hbs");
app.set("views", template_Path);
hbs.registerPartials(partials_Path);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Use the Contact model to find a user with the provided email
    const userData = await Contact.findOne({ email });

    // compare password using bcrypt compare function
    bcrypt.compare(password, userData.password, function () {
      if (!userData) {
        // If no user is found with the provided email
        return res.status(400).send("Invalid user email and password");
      }
      if (userData) {
        res.render("index");
      } else {
        res.status(400).send("Invalid user email and password");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signup", async (req, res) => {
  const data = await Contact(req.body);
  if (!data) {
    res.status(401).send(data);
  }
  data.save();
  console.log("Data Save Successfully");
  res.render("index");
});

const run = async () => {
  await connectDB(process.env.MONGO_DB_URI);
  app.listen(Port, () => {
    console.log(`Live on port ${Port}`);
  });
};
run();

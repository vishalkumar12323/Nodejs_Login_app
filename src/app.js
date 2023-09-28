require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const connectDB = require("../db/dataBaseConnections");
const Contact = require("../model/contactSchema");
const authentication = require("./middleware/authentication");

const Port = process.env.PORT || 3000;
const app = express();
app.use(cookieParser());
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
app.get("/store", authentication, (req, res) => {
  res.render("store");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await Contact.findOne({ email });

    const isVerify = await bcrypt.compare(password, userData.password);
    const token = await userData.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 500000),
      httpOnly: true,
    });
    if (isVerify === true) {
      res.render("index");
    } else {
      return res.status(400).send("Invalid user email and password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signup", async (req, res) => {
  try {
    const data = new Contact(req.body);
    await data.save();

    const token = await data.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 500000),
      httpOnly: true,
    });
    console.log("Data Save Successfully");
    res.render("index");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

const run = async () => {
  await connectDB(process.env.MONGO_DB_URI);
  app.listen(Port, () => {
    console.log(`Live on port ${Port}`);
  });
};
run();

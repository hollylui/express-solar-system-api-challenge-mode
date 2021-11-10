//! Task 2 --------------------------------------------
const express = require("express");
const app = express();

const dotenv = require("dotenv").config();
const { PORT: port } = process.env;

//! Task 3 --------------------------------------------

const planetsRoute = require("./route/planets");
const satellitesRoute = require("./route/satellites");

app.use("/planets", planetsRoute);
app.use("/satellites", satellitesRoute);

app.listen(port, () => console.log("Server is listening."));

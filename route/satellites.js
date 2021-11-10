const express = require("express");
const router = express.Router();
const satellitesData = require("../data/satellites-dataset");

//! Task 4 --------------------------------------------

// Regex
const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?`~]/;

let satelliteEndpoints,
  splitEndpoint,
  joinEndpoint,
  paramOne,
  paramTwo,
  pick,
  removeNull,
  satellites,
  max,
  min,
  index,
  unit;

const paths = [];

satelliteEndpoints = ["name", "radius", "density"];

satelliteEndpoints.map((endpoint) => {
  // modify name of endpoint------------------------
  splitEndpoint = endpoint.split(" ");

  if (splitEndpoint.length > 0) {
    for (let i = 1; i < splitEndpoint.length; i++) {
      splitEndpoint[i] =
        splitEndpoint[i][0].toUpperCase() + splitEndpoint[i].slice(1);
    }
  }

  joinEndpoint = splitEndpoint.join("");
  paths.push(joinEndpoint);

  paths.map((path) => {
    // when endpoint is name
    if (path === "name") path = "search";
    paramOne = path === "name" ? "name" : "pick";
    paramTwo = path === "name" ? "(*)" : "";

    // router
    router.get(`/${path}/:${paramOne}${paramTwo}`, (req, res) => {
      pick = req.params[paramOne].toLowerCase();

      // remove null properties
      removeNull = satellitesData.filter((data) => data[path] !== null);

      // search name
      if (path === "search") {
        if (specialChars.test(pick))
          return res.status(500).json("Please amend the name");

        const satellite = removeNull.find(
          (item) => item.name.toLowerCase() === pick
        );

        return satellite
          ? res.json(satellite)
          : res.status(400).json("Data is not found.");
      }

      // find max and min
      satellites = removeNull.map((item) => item[path]);
      max = Math.max(...satellites);
      min = Math.min(...satellites);

      pick === "max"
        ? (index = satellites.indexOf(max))
        : pick === "min"
        ? (index = satellites.indexOf(min))
        : res.status(500).json("Please input max or min.");

      // get unit
      unit =
        path === "diameter" || path === "distanceFromSun" || path === "radius"
          ? "km"
          : path === "meanTemperature"
          ? "°C"
          : path === "lengthOfDay"
          ? "hours"
          : path === "orbitalPeriod"
          ? "days"
          : path === "density"
          ? "g/cm3"
          : "";

      return res.json(
        `The ${pick} ${endpoint} satellite is ${satellitesData[index].name}, total is ${satellitesData[index][path]} ${unit}.`
      );
    });
  });
});

module.exports = router;

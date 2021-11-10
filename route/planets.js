const express = require("express");
const router = express.Router();
const planetsData = require("../data/planets-dataset");

//! Task 5 --------------------------------------------

// Regex
const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/;

// put endpoints as array
planetsEndpoints = [
  "name",
  "diameter",
  "number of moons",
  "distance from sun",
  "mean temperature",
  "length of day",
  "orbital period",
];

// set variables
let splitEndpoint,
  joinEndpoint,
  removeNull,
  planets,
  pick,
  index,
  max,
  min,
  allPlanets,
  allNames;

// assign empty array
const paths = [];

//! map to get all url parameters
planetsEndpoints.map((endpoint) => {
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

  //! router.get()

  paths.map((path) => {
    // check path
    if (path === "name") path = "search";

    router.get(`/${path}/:pick`, (req, res) => {
      pick = req.params.pick.toLowerCase();

      // remove any null in properties
      removeNull = planetsData.filter((item) => item[path] !== null);

      // search name
      if (path === "search") {
        if (specialChars.test(pick))
          return res.status(500).json("Please amend the input name.");

        const planet = planetsData.find(
          (planet) => planet.name.toLowerCase() === pick
        );

        return planet
          ? res.json(planet)
          : res.status(404).json("The data is not found.");
      }

      // get max and min
      planets = removeNull.map((item) => item[path]);
      max = Math.max(...planets);
      min = Math.min(...planets);

      // get index
      pick === "max"
        ? (index = planets.indexOf(max))
        : pick == "min"
        ? (index = planets.indexOf(min))
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

      if (planetsData[index][path] === 0) {
        allPlanets = planetsData.filter((item) => item[path] === 0);
        allNames = allPlanets.map((item) => item.name);
        return res.json(allNames);
      }

      return res.json(
        `The ${pick} ${endpoint} planet is ${planetsData[index].name}, total is ${planetsData[index][path]} ${unit}.`
      );
    });
  });
});

module.exports = router;

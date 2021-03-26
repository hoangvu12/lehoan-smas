const siteRoute = require("./site");
const apiRoute = require("./api.js");

module.exports = function (app) {
  app.use("/", siteRoute);

  app.use("/api/v1", apiRoute);
};

(async () => {
  const express = require("express");
  const { DI } = require("./utils");
  const { ReportProvider, CustomerProvider } = require("./providers");
  const { reportRouter, customerRouter } = require("./routes");
  const { responseMiddleware } = require("./middleware");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const jwt = require("express-jwt");
  const app = express();
  const port = 3044;

  let reportProvider = {};
  let customerProvider = {};

  reportProvider = await new ReportProvider({
    mongoUrl: "mongodb://report:reportz@mongo:27017",
    dbName: `report`
  }).createConnection();

  customerProvider = await new CustomerProvider({
    mongoUrl: "mongodb://report:reportz@mongo:27017",
    dbName: `report`
  }).createConnection();

  DI.set("reportProvider", reportProvider);
  DI.set("customerProvider", customerProvider);

  app.use(cors());
  app.use(responseMiddleware);
  app.use(bodyParser.json());

  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/report", reportRouter.router);
  app.use("/customer", customerRouter.router);

  app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
  );
})();

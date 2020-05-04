const express = require("express");
const router = express.Router();
const { ReportUsecase } = require("../usecases");
const { ReportMongo } = require("../formatters");
const { ReportRepo } = require("../repositories");
const { DI } = require("../utils");

const createReport = async (req, res) => {
  const { data } = req.body;
  try {
    if (!data) {
      res.formatter.badRequest("not found data in your request body");
    }
    const reportProvider = DI.get("reportProvider");
    const reportRepo = new ReportRepo({
      reportProvider,
      ReportMongo
    });
    const reportUsecase = new ReportUsecase(reportRepo);
    const createdResult = await reportUsecase.createReport(data);
    res.formatter.created(createdResult);
  } catch (error) {
    console.error(error);
    res.formatter.badRequest();
  }
};

router.post("/create", createReport);
module.exports = {
  router
};

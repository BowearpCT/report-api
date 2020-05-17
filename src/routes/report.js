const express = require("express");
const router = express.Router();
const { ReportUsecase } = require("../usecases");
const { ReportMongo, ReportFormatter } = require("../formatters");
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

const getLatestReportFromCustomerId = async (req, res) => {
  let reports = null;
  const { id } = req.params;
  try {
    if (!id) {
      return res.formatter.badRequest("Not found id from your params.");
    }
    const reportProvider = DI.get("reportProvider");
    const reportRepo = new ReportRepo({
      reportProvider,
      ReportFormatter
    });
    const reportUsecase = new ReportUsecase(reportRepo);
    reports = await reportUsecase.getLatestReportFromCustomerId(id);
    res.formatter.ok(reports);
  } catch (error) {
    console.error(error);
    res.formatter.serverError();
  }
};

router.post("/create", createReport);
router.get("/customer/:id", getLatestReportFromCustomerId);
module.exports = {
  router
};

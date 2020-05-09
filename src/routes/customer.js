const express = require("express");
const router = express.Router();
const { CustomerUsecase } = require("../usecases");
const { CustomerMongo, CustomerFormatter } = require("../formatters");
const { CustomerRepo } = require("../repositories");
const { DI } = require("../utils");

const createCustomer = async (req, res) => {
  const { data } = req.body;
  try {
    if (!data) {
      res.formatter.badRequest("not found data in your request body");
    }
    const customerProvider = DI.get("customerProvider");
    const customerRepo = new CustomerRepo({
      customerProvider,
      CustomerMongo
    });
    const customerUsecase = new CustomerUsecase(customerRepo);
    const createdResult = await customerUsecase.createCustomer(data);
    res.formatter.created(createdResult);
  } catch (error) {
    console.error(error);
    res.formatter.badRequest();
  }
};

const getCustomer = async (req, res) => {
  try {
    const customerProvider = DI.get("customerProvider");
    const customerRepo = new CustomerRepo({
      customerProvider,
      CustomerFormatter
    });
    const customerUsecase = new CustomerUsecase(customerRepo);
    const customers = await customerUsecase.getCustomer();
    res.formatter.ok(customers);
  } catch (error) {
    console.error(error);
    res.formatter.serverError();
  }
};

router.post("/create", createCustomer);
router.get("/", getCustomer);

module.exports = {
  router,
  getCustomer
};

const express = require("express");
const router = express.Router();
const { CustomerUsecase } = require("../usecases");
const { CustomerMongo } = require("../formatters");
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

router.post("/create", createCustomer);
module.exports = {
  router
};

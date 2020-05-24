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
      return res.formatter.badRequest("not found data in your request body");
    }
    const customerProvider = DI.get("customerProvider");
    const customerRepo = new CustomerRepo({
      customerProvider,
      CustomerMongo,
    });
    const customerUsecase = new CustomerUsecase(customerRepo);
    const createdResult = await customerUsecase.createCustomer(data);
    res.formatter.created(createdResult);
  } catch (error) {
    console.error(error);
    res.formatter.badRequest();
  }
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.formatter.badRequest("id not found in your params");
    }
    const customerProvider = DI.get("customerProvider");
    const customerRepo = new CustomerRepo({
      customerProvider,
    });
    const customerUsecase = new CustomerUsecase(customerRepo);
    await customerUsecase.deleteCustomer(id);
    res.formatter.ok();
  } catch (error) {
    console.error(error);
    res.formatter.serverError();
  }
};

const editCustomer = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  try {
    if (!data) {
      return res.formatter.badRequest("data in found on your body.");
    }
    if (!id) {
      return res.formatter.badRequest("id not found in your params");
    }
    const customerProvider = DI.get("customerProvider");
    const customerRepo = new CustomerRepo({
      customerProvider,
      CustomerMongo,
    });
    const customerUsecase = new CustomerUsecase(customerRepo);
    await customerUsecase.editCustomer(id, data);
    res.formatter.ok();
  } catch (error) {
    console.error(error);
    res.formatter.serverError();
  }
};

const getCustomer = async (req, res) => {
  try {
    const customerProvider = DI.get("customerProvider");
    const customerRepo = new CustomerRepo({
      customerProvider,
      CustomerFormatter,
    });
    const customerUsecase = new CustomerUsecase(customerRepo);
    const customers = await customerUsecase.getCustomer();
    res.formatter.ok(customers);
  } catch (error) {
    console.error(error);
    res.formatter.serverError();
  }
};

router.get("/", getCustomer);
router.post("/create", createCustomer);
router.put("/:id", editCustomer);
router.delete("/:id", deleteCustomer);

module.exports = {
  router,
  getCustomer,
  editCustomer,
};

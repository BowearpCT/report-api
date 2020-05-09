const { Customer } = require("../entities");

class CustomerUsecase {
  constructor(repo) {
    this.customerRepo = repo;
  }
  async createCustomer(data) {
    let createdResult = {
      success: false
    };
    try {
      const customer = new Customer({ ...data });
      createdResult.success = await this.customerRepo.createCustomer(customer);
    } catch (error) {
      throw error;
    }

    return createdResult;
  }

  async getCustomer() {
    let customers = null;
    try {
      customers = await this.customerRepo.getCustomer();
    } catch (error) {
      throw error;
    }

    return customers;
  }
}

module.exports = CustomerUsecase;

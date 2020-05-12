const { Customer } = require("../entities");
class CustomerRepo {
  constructor({ customerProvider, CustomerMongo, CustomerFormatter }) {
    this.customerProvider = customerProvider;
    this.customerMongo = CustomerMongo;
    this.customerFormatter = CustomerFormatter;
  }
  async createCustomer(customer) {
    let success = true;

    try {
      await this.customerProvider.create(this.customerMongo.format(customer));
    } catch (error) {
      throw error;
    }

    return success;
  }

  async getCustomer() {
    let customers = null;

    try {
      const result = await this.customerProvider.find();
      customers = result.map(
        item => new Customer(this.customerFormatter.format(item))
      );
    } catch (error) {
      throw error;
    }

    return customers;
  }

  async editCustomer(id, editData) {
    try {
      await this.customerProvider.updateById(id, editData);
    } catch (error) {
      throw error;
    }
  }

  async deleteCustomer(id) {
    try {
      await this.customerProvider.deleteById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CustomerRepo;

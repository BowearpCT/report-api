const { Customer } = require("../entities");
class CustomerRepo {
  constructor({ customerProvider, CustomerMongo, CustomerFormatter }) {
    this.customerProvider = customerProvider;
    this.customerMongo = CustomerMongo;
    this.customerFormatter = CustomerFormatter;
  }
  async createCustomer(customer) {
    let success = false;

    try {
      const found = await this.customerProvider.findOne({
        name: customer.name,
      });
      console.log("customer id", customer.name);
      console.log("customer id", found);
      if (!found) {
        await this.customerProvider.create(this.customerMongo.format(customer));
        success = true;
      }
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
        (item) => new Customer(this.customerFormatter.format(item))
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

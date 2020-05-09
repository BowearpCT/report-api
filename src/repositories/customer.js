class CustomerRepo {
  constructor({ customerProvider, CustomerMongo }) {
    this.customerProvider = customerProvider;
    this.customerMongo = CustomerMongo;
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
}

module.exports = CustomerRepo;

const MongoProvider = require("./mongo");

class CustomerProvider extends MongoProvider {
  constructor(options) {
    super(options);
    const { mongoUrl, dbName } = options;
    this.mongoUrl = mongoUrl;
    this.db = dbName;
    this.collection = "customer";
  }
}

module.exports = CustomerProvider;

const MongoProvider = require("./mongo");

class ReportProvider extends MongoProvider {
  constructor(options) {
    super(options);

    const { mongoUrl, dbName } = options;
    this.mongoUrl = mongoUrl;
    this.db = dbName;
    this.collection = "report";
  }
}

module.exports = ReportProvider;

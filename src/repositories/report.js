const { Report } = require("../entities");

class ReportRepo {
  constructor({ reportProvider, ReportMongo, ReportFormatter }) {
    this.reportProvider = reportProvider;
    this.reportMongo = ReportMongo;
    this.reportFormatter = ReportFormatter;
  }
  async createReport(report) {
    let success = true;

    try {
      await this.reportProvider.create(this.reportMongo.format(report));
    } catch (error) {
      throw error;
    }

    return success;
  }

  async getReportFromCustomerId(customerId) {
    let reports = null;
    const filter = { customer_id: customerId };
    try {
      reports = await this.reportProvider.find(filter);
      // reports = result.map(doc => new Report({ ...doc }));
    } catch (error) {
      throw error;
    }

    return reports;
  }
}

module.exports = ReportRepo;

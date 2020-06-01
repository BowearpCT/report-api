const { Report } = require("../entities");
const moment = require("moment-timezone");
class ReportRepo {
  constructor({ reportProvider, ReportMongo, ReportFormatter }) {
    this.reportProvider = reportProvider;
    this.reportMongo = ReportMongo;
    this.reportFormatter = ReportFormatter;
  }
  async createReport(report) {
    let success = false;
    try {
      const filter = {
        daily_date: report.dailyDate,
        customer_id: report.customerId,
      };
      const found = await this.reportProvider.findOne(filter);
      if (found) {
        await this.reportProvider.deleteById(found._id);
      }
      success = true;
      await this.reportProvider.create(this.reportMongo.format(report));
    } catch (error) {
      throw error;
    }

    return success;
  }

  async checkReport(customerId, date) {
    let existing = false;
    const filter = {
      customer_id: customerId,
      daily_date: date,
    };
    try {
      const found = await this.reportProvider.findOne(filter);
      if (found) {
        existing = true;
      }
    } catch (error) {
      throw error;
    }
    return existing;
  }

  async getReportFromCustomerIdAndDate(customerId, date) {
    let reports = null;
    const filter = {
      customer_id: customerId,
      daily_date: {
        $in: date,
      },
    };
    try {
      console.log("fileter", filter);
      reports = await this.reportProvider.find(filter);
      // console.log(reports);
    } catch (error) {
      throw error;
    }

    return reports;
  }

  async getReportFromCustomerId(customerId) {
    let reports = null;
    const filter = { customer_id: customerId };
    try {
      reports = await this.reportProvider.find(filter);
    } catch (error) {
      throw error;
    }

    return reports;
  }
}

module.exports = ReportRepo;

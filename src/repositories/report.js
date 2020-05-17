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
        customer_id: report.customerId
      };
      const found = await this.reportProvider.find(filter);
      console.log("found", found);
      if (found.length == 0) {
        success = true;
        await this.reportProvider.create(this.reportMongo.format(report));
      }
    } catch (error) {
      throw error;
    }

    return success;
  }

  async getLatestReportFromCustomerId(customerId) {
    let reports = null;
    const filter = { customer_id: customerId };
    try {
      reports = await this.reportProvider.find(filter);
      // reports = result.map(report => {
      //   console.log(
      //     moment.tz(report.created_at, "Asia/Bangkok").format("YYYY-MM-DD")
      //   );
      //   report.created_at = moment
      //     .tz(report.created_at, "Asia/Bangkok")
      //     .format("YYYY-MM-DD");
      //   return report;
      // });
      // reports = result.map(doc => new Report({ ...doc }));
    } catch (error) {
      throw error;
    }

    return reports;
  }
}

module.exports = ReportRepo;

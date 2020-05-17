const { Report } = require("../entities");
const moment = require("moment");

class ReportUsecase {
  constructor(repo) {
    this.reportRepo = repo;
  }
  async createReport(data) {
    let createdResult = {
      success: false
    };
    try {
      const report = new Report({ ...data });
      createdResult.success = await this.reportRepo.createReport(report);
    } catch (error) {
      throw error;
    }

    return createdResult;
  }

  async getLatestReportFromCustomerId(customerId) {
    let latestReport = null;

    try {
      const reports = await this.reportRepo.getLatestReportFromCustomerId(
        customerId
      );
      latestReport = reports.reduce(
        (acc, report) => {
          if (moment(acc[0].daily_date).isBefore(report.daily_date)) {
            acc[0] = report;
          }
          return acc;
        },
        [
          {
            daily_date: moment("2018-01-01").format("YYYY-MM-DD")
          }
        ]
      );
    } catch (error) {
      throw error;
    }

    return latestReport;
  }
}

module.exports = ReportUsecase;

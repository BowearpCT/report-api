const { Report } = require("../entities");

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

  async getReportFromCustomerId(customerId) {
    let reports = null;

    try {
      reports = await this.reportRepo.getReportFromCustomerId(customerId);
    } catch (error) {
      throw error;
    }

    return reports;
  }
}

module.exports = ReportUsecase;

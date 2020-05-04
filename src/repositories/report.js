class ReportRepo {
  constructor({ reportProvider, ReportMongo }) {
    this.reportProvider = reportProvider;
    this.reportMongo = ReportMongo;
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
}

module.exports = ReportRepo;

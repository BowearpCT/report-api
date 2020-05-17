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
      const reports = await this.reportRepo.getReportFromCustomerId(customerId);
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

  async getEngagementMovement(customerId, period, date) {
    let movements = null;
    let dateOfPeriod = [];
    const end = date;
    const start = moment(date)
      .subtract(period, "days")
      .format("YYYY-MM-DD");
    let current = moment(end)
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    try {
      const reports = await this.reportRepo.getReportFromCustomerId(customerId);
      while (moment(current).isAfter(start)) {
        dateOfPeriod.push(current);
        current = moment(current)
          .subtract(1, "days")
          .format("YYYY-MM-DD");
      }
      movements = dateOfPeriod.reduce((acc, date) => {
        const filteredReport = reports.find(report =>
          moment(report.daily_date).isSame(date)
        );
        let movement = {};
        if (filteredReport) {
          movement = {
            Date: filteredReport.daily_date,
            Engagement: Object.values(
              filteredReport.engagement_by_channel
            ).reduce((a, b) => a + b, 0),
            Messages: Object.keys(filteredReport.message_by_channel).reduce(
              (messageChannel, channel) => {
                messageChannel[`${channel}`] = Object.values(
                  filteredReport.message_by_channel[`${channel}`]
                ).reduce((a, b) => a + b, 0);
                return { ...messageChannel };
              },
              {}
            )
          };
          movement.Messages = Object.values(movement.Messages).reduce(
            (a, b) => a + b,
            0
          );
        } else {
          movement = {
            Date: date,
            Engagement: 0,
            Messages: 0
          };
        }
        return [...acc, movement];
      }, []);
    } catch (error) {
      throw error;
    }
    return movements;
  }
}

module.exports = ReportUsecase;

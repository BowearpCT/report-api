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

  async getReportFromCustomerIdAndDate(customerId, date) {
    let reports = null;

    try {
      const result = await this.reportRepo.getReportFromCustomerIdAndDate(
        customerId,
        date
      );
      if (result.length !== 0) {
        reports = result;
      } else {
        reports = [
          {
            _id: "rp_kab4yqrn",
            customer_id: "c_ka67z4l8",
            message_by_channel: {
              Instagram: {
                "no report": 0
              },
              Facebook: {
                "no report": 0
              },
              News: {
                "no report": 0
              },
              Twitter: {
                "no report": 0
              },
              Youtube: {
                "no report": 0
              },
              Forum: {
                "no report": 0
              }
            },
            daily_date: date,
            engagement_by_channel: {
              Instagram: 0,
              Facebook: 0,
              News: 0,
              Twitter: 0,
              Youtube: 0,
              Forum: 0
            },
            top_account: [],
            summary_message: [""],
            sentiment: {
              Positive: 0,
              Negative: 0,
              Neutral: 0,
              Crisis: 0
            },
            created_at: "2020-05-17T14:09:32.788Z",
            updated_at: "2020-05-17T14:09:32.788Z",
            deleted_at: null
          }
        ];
      }
    } catch (error) {
      throw error;
    }
    return reports;
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

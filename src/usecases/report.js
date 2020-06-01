const { Report } = require("../entities");
const moment = require("moment");

class ReportUsecase {
  constructor(repo) {
    this.reportRepo = repo;
  }
  async createReport(data) {
    let createdResult = {
      success: false,
    };
    try {
      const report = new Report({ ...data });
      createdResult.success = await this.reportRepo.createReport(report);
    } catch (error) {
      throw error;
    }

    return createdResult;
  }

  async checkReport(customerId, date) {
    let existing;
    try {
      existing = await this.reportRepo.checkReport(customerId, date);
    } catch (error) {
      throw error;
    }
    return existing;
  }

  async getReportFromCustomerIdAndDate(customerId, date, period) {
    let reports = null;
    let dateOfPeriod = [];

    try {
      for (let i = 0; i < period; i++) {
        dateOfPeriod.push(
          moment(date).subtract(i, "days").format("YYYY-MM-DD")
        );
      }
      const result = await this.reportRepo.getReportFromCustomerIdAndDate(
        customerId,
        dateOfPeriod
      );
      if (result.length !== 0) {
        let report = {};
        const reportFromDate = result.find((rp) => rp.daily_date == date);

        const channels = [
          "Facebook",
          "Twitter",
          "Instagram",
          "Youtube",
          "News",
          "Forum",
        ];

        const categories = [
          ...new Set(
            result.reduce((acc, report) => {
              return [
                ...acc,
                ...Object.keys(report.message_by_channel.Facebook),
              ];
            }, [])
          ),
        ];

        const topAccount = channels.map((channel) => {
          return result.reduce((acc, report) => {
            const filtered = report.top_account.find((topAccount) => {
              return topAccount[0].channel == channel.toLowerCase();
            });
            if (filtered) {
              return [...acc, ...filtered];
            } else {
              return [...acc];
            }
          }, []);
        });
        if (reportFromDate) {
          report._id = reportFromDate._id;
          report.summary_message = reportFromDate.summary_message;
        } else {
          report._id = "";
          report.summary_message = [];
        }
        report.daily_date = date;
        report.customer_id = customerId;

        report.message_by_channel = result.reduce((acc, cur) => {
          for (const channel of channels) {
            if (!cur.message_by_channel[`${channel}`]) {
              continue;
            }
            if (!acc[`${channel}`]) {
              acc[`${channel}`] = {};
            }
            for (const category of categories) {
              if (
                acc[`${channel}`][`${category}`] &&
                cur.message_by_channel[`${channel}`][`${category}`]
              ) {
                acc[`${channel}`][`${category}`] +=
                  cur.message_by_channel[`${channel}`][`${category}`];
              } else if (cur.message_by_channel[`${channel}`][`${category}`]) {
                acc[`${channel}`][`${category}`] =
                  cur.message_by_channel[`${channel}`][`${category}`];
              } else if (acc[`${channel}`][`${category}`]) {
                acc[`${channel}`][`${category}`] =
                  acc[`${channel}`][`${category}`];
              } else {
                acc[`${channel}`][`${category}`] = 0;
              }
            }
          }
          return { ...acc };
        }, {});

        report.engagement_by_channel = result.reduce((acc, cur) => {
          for (const channel of channels) {
            if (!acc[`${channel}`]) {
              acc[`${channel}`] = 0;
            }
            if (cur.engagement_by_channel[`${channel}`]) {
              acc[`${channel}`] += cur.engagement_by_channel[`${channel}`];
            }
          }
          return { ...acc };
        }, {});

        report.top_account = topAccount.map((cur) => {
          let sortedAccount = cur.sort((a, b) => b.engagement - a.engagement);
          if (sortedAccount.length != 0) {
            sortedAccount.length = 3;
          } else {
            sortedAccount = [
              {
                name: "No top account",
                engagemnt: "0",
                channel: cur.channel,
                image: null,
              },
              {
                name: "No top account",
                engagemnt: "0",
                channel: cur.channel,
                image: null,
              },
              {
                name: "No top account",
                engagemnt: "0",
                channel: cur.channel,
                image: null,
              },
            ];
          }
          return [...sortedAccount];
        });

        report.sentiment = result.reduce((acc, cur) => {
          acc.Positive = acc.Positive
            ? acc.Positive + cur.sentiment.Positive
            : cur.sentiment.Positive;
          acc.Negative = acc.Negative
            ? acc.Negative + cur.sentiment.Negative
            : cur.sentiment.Negative;
          acc.Neutral = acc.Neutral
            ? acc.Neutral + cur.sentiment.Neutral
            : cur.sentiment.Neutral;
          acc.Crisis = acc.Crisis
            ? acc.Crisis + cur.sentiment.Crisis
            : cur.sentiment.Crisis;
          return { ...acc };
        }, {});

        reports = [report];
      } else {
        reports = [
          {
            _id: "rp_kab4yqrn",
            customer_id: "c_ka67z4l8",
            message_by_channel: {
              Instagram: {
                "no report": 0,
              },
              Facebook: {
                "no report": 0,
              },
              News: {
                "no report": 0,
              },
              Twitter: {
                "no report": 0,
              },
              Youtube: {
                "no report": 0,
              },
              Forum: {
                "no report": 0,
              },
            },
            daily_date: date,
            engagement_by_channel: {
              Instagram: 0,
              Facebook: 0,
              News: 0,
              Twitter: 0,
              Youtube: 0,
              Forum: 0,
            },
            top_account: [],
            summary_message: [""],
            sentiment: {
              Positive: 0,
              Negative: 0,
              Neutral: 0,
              Crisis: 0,
            },
            created_at: "2020-05-17T14:09:32.788Z",
            updated_at: "2020-05-17T14:09:32.788Z",
            deleted_at: null,
          },
        ];
      }
    } catch (error) {
      throw error;
    }
    return reports;
  }

  async getLatestReportFromCustomerId(customerId) {
    let latestReport = [];

    try {
      const reports = await this.reportRepo.getReportFromCustomerId(customerId);
      if (reports.length !== 0) {
        latestReport = reports.reduce(
          (acc, report) => {
            if (moment(acc[0].daily_date).isBefore(report.daily_date)) {
              acc[0] = report;
            }
            return acc;
          },
          [
            {
              daily_date: moment("2018-01-01").format("YYYY-MM-DD"),
            },
          ]
        );
      }
    } catch (error) {
      throw error;
    }
    return latestReport;
  }

  async getEngagementMovement(customerId, period, date) {
    let movements = null;
    let dateOfPeriod = [];
    const end = date;
    const start = moment(date).subtract(period, "days").format("YYYY-MM-DD");
    let current = moment(end).subtract(1, "days").format("YYYY-MM-DD");
    try {
      const reports = await this.reportRepo.getReportFromCustomerId(customerId);
      while (moment(current).isAfter(start)) {
        dateOfPeriod.push(current);
        current = moment(current).subtract(1, "days").format("YYYY-MM-DD");
      }
      movements = dateOfPeriod.reduce((acc, date) => {
        const filteredReport = reports.find((report) =>
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
            ),
          };
          movement.Messages = Object.values(movement.Messages).reduce(
            (a, b) => a + b,
            0
          );
        } else {
          movement = {
            Date: date,
            Engagement: 0,
            Messages: 0,
          };
        }
        return [...acc, movement];
      }, []);
    } catch (error) {
      throw error;
    }
    return movements;
  }

  async getEngagementMovementByChannel(customerId, period, date, channel) {
    let movements = null;
    let dateOfPeriod = [];
    try {
      for (let i = 0; i < period; i++) {
        dateOfPeriod.push(
          moment(date).subtract(i, "days").format("YYYY-MM-DD")
        );
      }
      const reports = await this.reportRepo.getReportFromCustomerId(customerId);

      movements = dateOfPeriod.reduce((acc, date) => {
        const filteredReport = reports.find((report) => {
          return moment(report.daily_date).isSame(date);
        });
        let movement = {};
        console.log("filtered report", filteredReport);
        if (filteredReport) {
          movement = {
            Date: filteredReport.daily_date,
            Engagement: filteredReport.engagement_by_channel[`${channel}`]
              ? filteredReport.engagement_by_channel[`${channel}`]
              : 0,
            Messages: filteredReport.message_by_channel[`${channel}`]
              ? Object.values(
                  filteredReport.message_by_channel[`${channel}`]
                ).reduce((a, b) => a + b, 0)
              : 0,
          };
          console.log("channel", channel);
          console.log("MOVEMENT I SAD", movement);
        } else {
          movement = {
            Date: date,
            Engagement: 0,
            Messages: 0,
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

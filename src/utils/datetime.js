const Moment = require("moment-timezone");
const { extendMoment } = require("moment-range");
const moment = extendMoment(Moment);

class Datetime {
  static now(timezone = "UTC") {
    return moment()
      .tz(timezone)
      .toDate();
  }

  static toDate(datetime) {
    return moment(datetime).toDate();
  }

  static toFormat(
    datetime,
    fromFormat = "YYYY-MM-DD HH:mm:ss",
    toFormat = "YYYY-MM-DD HH:mm:ss"
  ) {
    return moment(datetime, fromFormat).format(toFormat);
  }

  static toTimezone(datetime, toTimezone = "Asia/Bangkok") {
    return moment.utc(datetime).tz(toTimezone);
  }

  static getListOfPeriod(start, end, format = "YYYY_MM", rangeBy = "month") {
    const momentStart = moment(start, "YYYY-MM-DD");
    const momentEnd = moment(end, "YYYY-MM-DD");
    const range = moment.range(momentStart, momentEnd);

    let dateRange = [];

    for (const month of range.by(rangeBy)) {
      dateRange.push(month.format(format));
    }

    return dateRange;
  }
}

module.exports = Datetime;

class Report {
  constructor({
    id,
    customer_id,
    messages_by_channel,
    engagement_by_channel,
    daily_date,
    top_account,
    summary_message,
    sentiment
  }) {
    this.id = id;
    this.customerId = customer_id;
    this.messageByChannel = messages_by_channel;
    this.dailyDate = daily_date;
    this.engagementByChannel = engagement_by_channel;
    this.topAccount = top_account;
    this.summaryMessage = summary_message;
    this.sentiment = sentiment;
  }
}

module.exports = Report;

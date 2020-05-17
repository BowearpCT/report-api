class ReportMongo {
  static format(doc) {
    return {
      _id: doc.id,
      customer_id: doc.customerId,
      message_by_channel: doc.messageByChannel,
      daily_date: doc.dailyDate,
      engagement_by_channel: doc.engagementByChannel,
      top_account: doc.topAccount,
      summary_message: doc.summaryMessage,
      sentiment: doc.sentiment
    };
  }
}

module.exports = ReportMongo;

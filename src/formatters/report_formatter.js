class ReportFormatter {
  static format(doc) {
    return {
      _id: doc.id,
      customerId: doc.customer_id,
      messageByChannel: doc.message_by_channel,
      topAccount: doc.top_account,
      summaryMessage: doc.summary_message,
      sentiment: doc.sentiment
    };
  }
}

module.exports = ReportFormatter;

class ReportMongo {
  static format(doc) {
    return {
      _id: doc.id,
      customer_id: doc.customerId,
      message_by_channel: doc.messageByChannel,
      top_account: doc.topAccount,
      summary_message: doc.summaryMessage,
      sentiment: doc.sentiment
    };
  }
}

module.exports = ReportMongo;

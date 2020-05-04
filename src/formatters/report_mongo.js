class ReportMongo {
  static format(doc) {
    return {
      _id: doc.id,
      ...doc
    };
  }
}

module.exports = ReportMongo;

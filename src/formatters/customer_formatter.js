class CustomerFormatter {
  static format(doc) {
    return {
      id: doc._id,
      name: doc.name
    };
  }
}

module.exports = CustomerFormatter;

class CustomerMongo {
  static format(doc) {
    return {
      _id: doc.id,
      ...doc
    };
  }
}

module.exports = CustomerMongo;

const { MongoClient } = require("mongodb");
const Datetime = require("../utils/datetime");
class MongoProvider {
  constructor({ mongoUrl, dbName, collectionName }) {
    this.mongoUrl = mongoUrl;
    this.db = dbName;
    this.collection = collectionName;
    this.connection = null;
  }

  async createConnection() {
    try {
      const connection = await MongoClient.connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      this.connection = connection.db(this.db).collection(this.collection);
    } catch (error) {
      throw error;
    }

    return this;
  }

  async find(filter = {}, projection = {}, options = {}) {
    if (!this.connection) {
      throw "Connection not found";
    }

    const { sort, start, limit } = options;
    const queryLimit = limit !== null && typeof limit === "number" ? limit : 0;
    const querySkip =
      start !== null && typeof start === "number" ? start - 1 : 0;
    const querySort = sort ? sort : { _id: 1 };

    let docs = [];

    try {
      docs = await this.connection
        .find({ ...filter, deleted_at: null }, projection)
        .sort(querySort)
        .limit(queryLimit)
        .skip(querySkip)
        .toArray();
    } catch (error) {
      throw error;
    }

    return docs;
  }

  async findOne(filter = {}, projection = {}) {
    if (!this.connection) {
      throw "Connection not found";
    }

    let doc = null;

    try {
      doc = await this.connection.findOne(
        { ...filter, deleted_at: null },
        projection
      );
    } catch (error) {
      throw error;
    }

    return doc;
  }

  async findById(id) {
    if (!this.connection) {
      throw "Connection not found";
    }

    let doc = null;

    try {
      const filter = { _id: id, deleted_at: null };
      doc = await this.connection.findOne(filter);
    } catch (error) {
      throw error;
    }

    return doc;
  }

  async create(data) {
    if (!this.connection) {
      throw "Connection not found";
    }

    let createResult = null;
    const { _id: id } = data;
    const now = Datetime.now();
    const insertData = {
      ...data,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };

    try {
      const foundData = await this.findById(`${id}`);

      if (!foundData) {
        createResult = await this.connection.insertOne(insertData);
      } else {
        throw "The account is already in the database";
      }
    } catch (error) {
      throw error;
    }

    return createResult;
  }

  async updateById(id, data) {
    if (!this.connection) {
      throw "Connection not found";
    }

    let updateResult = null;
    try {
      const now = Datetime.now();
      const updateData = {
        ...data,
        updated_at: now
      };

      const filter = { _id: id };
      const updateQuery = { $set: updateData };
      const updateOptions = { returnOriginal: false };

      updateResult = await this.connection.findOneAndUpdate(
        filter,
        updateQuery,
        updateOptions
      );
    } catch (error) {
      throw error;
    }

    return updateResult;
  }

  async deleteById(id) {
    if (!this.connection) {
      throw "Connection not found";
    }

    let deleteResult = null;

    try {
      const filter = { _id: id };
      deleteResult = await this.connection.deleteOne(filter);
      console.log();
    } catch (error) {
      throw error;
    }

    return deleteResult;
  }

  async updateAndPushById(id, data) {
    if (!this.connection) {
      throw "Connection not found";
    }

    let updateResult = null;
    try {
      const now = Datetime.now();
      const { setData, pushData } = data;

      const filter = { _id: id };
      const updateQuery = {
        $set: {
          ...setData,
          updated_at: now
        },
        $push: pushData
      };
      const updateOptions = { returnOriginal: false };

      updateResult = await this.connection.findOneAndUpdate(
        filter,
        updateQuery,
        updateOptions
      );
    } catch (error) {
      throw error;
    }

    return updateResult;
  }

  async aggregate(pipeline = []) {
    if (!this.connection) {
      throw "Connection not found";
    }

    let docs = null;

    try {
      docs = await this.connection.aggregate(pipeline).toArray();
    } catch (error) {
      throw error;
    }

    return docs;
  }

  async count(filter = {}) {
    if (!this.connection) {
      throw "Connection not found";
    }

    let count = 0;

    try {
      count = await this.connection.find(filter).count();
    } catch (error) {
      throw error;
    }

    return count;
  }
}

module.exports = MongoProvider;

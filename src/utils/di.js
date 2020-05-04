module.exports = {
  set: function(k, v) {
    this[k] = v;
    return true;
  },
  get: function(k) {
    if (k in this) {
      return this[k];
    }
    return null;
  }
};

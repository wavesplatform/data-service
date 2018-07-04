module.exports = (name, defaultData = null) => (data = defaultData) => ({
  __type: name,
  data,
});

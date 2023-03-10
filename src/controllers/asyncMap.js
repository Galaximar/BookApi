const asyncMap = async (array, callback) => {
  const results = await Promise.all(
    array.map(async (item) => {
      const result = await callback(item);
      return result;
    })
  );
  return results;
};

module.exports = asyncMap;

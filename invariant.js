module.exports = function invariant(condition, err) {
    if (condition) {
      return
    }
  
    throw err
}
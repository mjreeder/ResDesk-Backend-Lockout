module.exports = {
  hallParser: function (roomSpaceDescription) {
    var split = roomSpaceDescription.split(" ");
    return split[0];
  }
}
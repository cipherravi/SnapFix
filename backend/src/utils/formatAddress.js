function formatAddress(addressObj) {
  return [
    addressObj.building,
    addressObj.street,
    addressObj.area,
    addressObj.city,
    addressObj.district,
    addressObj.state,
  ]
    .filter(Boolean) // removes null/undefined
    .join(", ");
}

module.exports = formatAddress;

function formatAddress(addressObj) {
  return [
    addressObj.building,
    addressObj.street,
    addressObj.area.name,
    addressObj.area.city.name,
    addressObj.area.city.district.name,
    addressObj.area.city.district.state.name,
  ]
    .filter(Boolean) // removes null/undefined
    .join(", ");
}

module.exports = formatAddress;

export default function (routeOption) {
  function showMulitCloumns (name) {
    const arr = routeOption.multi.columns
    return arr.indexOf(name) !== -1
  }

  function showMulitDisabled (name) {
    const arr = routeOption.multi.disabled
    return arr.indexOf(name) !== -1
  }


  function showCoutomCloumns (name) {
    const arr = routeOption.coustom.columns
    return arr.indexOf(name) !== -1
  }

  function showCoutomDisabled (name) {
    const arr = routeOption.coustom.disabled
    return arr.indexOf(name) !== -1
  }

  return {
    showMulitDisabled,
    showMulitCloumns,
    showCoutomCloumns,
    showCoutomDisabled
  }
}
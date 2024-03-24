function calculateTotalBalance(response) {
    const balances = response.result;
    return parseInt(balances["0x0000000000000000000000000000000000000000"], 16);
  }


  module.exports = { calculateTotalBalance }
const axios = require("axios");
const { calculateTotalBalance } = require("./calculateBalance");

async function getZksyncBalance(evm_addresses) {
  try {
    const url = "https://mainnet.era.zksync.io";
    const response = await axios.post(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "zks_getAllAccountBalances",
      params: [evm_addresses],
    });
    let user_wei = "";
    let user_eth = "";
    if (Object.keys(response.data.result).length!==0) {
      user_wei = calculateTotalBalance(await response.data);
      user_eth = Number(user_wei) / Number(BigInt(1000000000000000000));
    }
    return user_eth;
  } catch (error) {
    console.error("Error making JSON-RPC call:", error);
    throw error;
  }
}

module.exports = { getZksyncBalance };

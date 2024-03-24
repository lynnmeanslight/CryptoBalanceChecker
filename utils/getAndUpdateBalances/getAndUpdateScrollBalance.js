const axios = require("axios");
require("dotenv").config();

async function getAndUpdateBalancesOfEthFromScroll(
  evm_addresses,
  sheets,
  spreadsheetId
) {
  try {
    const balances = [];
    const SCROLL_ETH_API_TOKEN = process.env.SCROLL_ETH_API_TOKEN;
    const len = evm_addresses.length;
    let startIndex = 0;
    let endIndex = 0;
    while (startIndex < len) {
      endIndex = startIndex + 20;
      const slicedArr = evm_addresses.slice(startIndex, endIndex);
      const url = `https://api.scrollscan.com/api?module=account&action=balancemulti&address=${slicedArr.join(
        ","
      )}&tag=latest&apikey=${SCROLL_ETH_API_TOKEN}`;
      const response = await axios.get(url);
      response.data.result.map((wallet) => {
        const user_wei = BigInt(wallet.balance);
        const user_eth = Number(user_wei) / Number(BigInt(1000000000000000000));
        balances.push([user_eth.toString()]);
      });
      if (startIndex != len) {
        startIndex = startIndex + 20;
      }
    }
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: "Sheet1!G2:G103",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: balances,
      },
    });
  } catch (error) {
    throw error;
  }
}

module.exports = { getAndUpdateBalancesOfEthFromScroll };

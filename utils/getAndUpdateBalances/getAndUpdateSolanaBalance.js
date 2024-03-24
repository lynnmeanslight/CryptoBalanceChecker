const SOLANA = require("@solana/web3.js");
const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = SOLANA;

async function getAndUpdateSolanaBalances(WALLET_ADDRESSES, sheets, spreadsheetId) {
  let startIndex = 0;
  let len = WALLET_ADDRESSES.length;

  while (startIndex < len) {
    let endIndex = startIndex + 5;
    const slicedArr = WALLET_ADDRESSES.slice(startIndex, endIndex);
    const balances = [];
    const range = `Sheet1!D${startIndex + 2}:D${endIndex + 2}`;
    for (let j = 0; j < slicedArr.length; j++) {
      const innerSolanaAddress = slicedArr[j];
      const balance = await getSolanaBalance(innerSolanaAddress);
      balances.push([balance.toString()]);
    }
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: balances,
      },
    });
    sleep(500);
    startIndex = startIndex + 5;
  }
}

async function getSolanaBalance(WALLET_ADDRESS) {
  const PUBLIC_CLUSTER = clusterApiUrl("mainnet-beta");
  const SOLANA_CONNECTION = new Connection(PUBLIC_CLUSTER);
  const balance = (async () => {
    const PUBLIC_KEY = new PublicKey(WALLET_ADDRESS);
    let balance = await SOLANA_CONNECTION.getBalance(PUBLIC_KEY);
    const result = balance / LAMPORTS_PER_SOL;
    return result;
  })();
  return balance;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { getAndUpdateSolanaBalances };

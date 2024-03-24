const { google } = require("googleapis");
const { getZksyncBalance } = require("../getAndUpdateBalances/getZksyncBalance");
require("dotenv").config();

const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID;
async function updateZksyncOnSheet(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: "Sheet1!B2:C103",
    });
    const rows = res.data.values;
    const evm_addresses = [];
    const evm_eth_zksync_balances = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const evm_address = row[0];
      evm_addresses.push(evm_address);
    }
    for (let index = 0; index < evm_addresses.length; index++) {
      const evm_address = evm_addresses[index];
      const eth_balance = await getZksyncBalance(evm_address);
      if(eth_balance==="")
      {
        evm_eth_zksync_balances.push(["Invalid"]);
      }
      else
      {
        evm_eth_zksync_balances.push([eth_balance.toString()]);
      }
    }
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREAD_SHEET_ID,
      range: "Sheet1!F2:F103",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: evm_eth_zksync_balances,
      },
    });
  }


   module.exports = { updateZksyncOnSheet }
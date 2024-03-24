const { google } = require("googleapis");
const { getAndUpdateBalancesOfEthFromScroll } = require("../getAndUpdateBalances/getAndUpdateScrollBalance");
const { getAndUpdateBalancesOfEthFromEth } = require("../getAndUpdateBalances/getAndUpdateEthBalance");
const { getAndUpdateBalancesOfEthFromBase } = require("../getAndUpdateBalances/getAndUpdateBaseBalance");

require("dotenv").config();

const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID;

async function update3evmsOnSheet(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: "Sheet1!B2:C103",
    });
    const rows = res.data.values;
  
    const evm_addresses = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const evm_address = row[0];
      evm_addresses.push(evm_address);
    }
    await getAndUpdateBalancesOfEthFromScroll(evm_addresses, sheets, SPREAD_SHEET_ID);
    await getAndUpdateBalancesOfEthFromEth(evm_addresses, sheets, SPREAD_SHEET_ID);
    await getAndUpdateBalancesOfEthFromBase(evm_addresses, sheets, SPREAD_SHEET_ID);
  }
  


  module.exports= { update3evmsOnSheet }
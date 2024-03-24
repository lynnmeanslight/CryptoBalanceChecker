const { google } = require("googleapis");
const { getSolanaBalance, getAndUpdateSolanaBalances } = require("../getAndUpdateBalances/getAndUpdateSolanaBalance");
require("dotenv").config();

const spreadSheetId = process.env.SPREAD_SHEET_ID;

async function updateSolanaOnSheet(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadSheetId,
      range: "Sheet1!B2:C103",
    });
    const rows = res.data.values;
  
    const solana_addresses = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const solana_address = row[1];
      solana_addresses.push(solana_address);
    }
    await getAndUpdateSolanaBalances(solana_addresses, sheets, spreadSheetId);
  }

  module.exports = { updateSolanaOnSheet }
const express = require("express");
const { authorize } = require("./utils/googleAuth/gAuth");
const { updateSolanaOnSheet } = require("./utils/updateBalances/updateSolanaBalance");
const { update3evmsOnSheet } = require("./utils/updateBalances/update3EVMBalance");
const { updateZksyncOnSheet } = require("./utils/updateBalances/updateZksyncBalance");

require("dotenv").config();



const app = express();
const port = 3000 ||  process.env.PORT;

app.use(express.json());
app.get("/threeevms", async (req, res) => {
  console.log(`Start updating three evms balances`);
  authorize().then(update3evmsOnSheet).catch(console.error);
  res.send("Updated three EVMs Balances!");
});
app.get("/zksyncevm", async (req, res) => {
  console.log(`Start updating zksync balances`);
  authorize().then(updateZksyncOnSheet).catch(console.error);
  res.send("Updated Zksync Balances!");
});
app.get("/solana", async (req, res) => {
  console.log(`Start updating solana balances`);
  authorize().then(updateSolanaOnSheet).catch(console.error);
  res.send("Updated Solana Balances!");
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

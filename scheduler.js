const path = require("path");
const node_cron = require("node-cron");
const coinModel = require(path.join(__dirname, "Models", "coinModel.js"));
require("dotenv").config();

const url = process.env.QUERY_URI;

const fetchAndStore = async () => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      console.log(await response.text());
      return;
    }

    const resp = await response.json();

    resp.forEach(async (data) => {
      let savingName = data.name.toLowerCase();
      if (savingName === "polygon") savingName = "matic";

      const coinData = new coinModel({
        name: savingName,
        price: parseFloat(data.current_price, 10),
        marketCap: parseFloat(data.market_cap, 10),
        change24h: parseFloat(data.price_change_24h, 10),
      });

      await coinData.save();
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

module.exports.schedulerInit = () => {
  node_cron.schedule("* */2 * * *", fetchAndStore);
};

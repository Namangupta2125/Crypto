const path = require("path");
const node_cron = require('node-cron');
const coinModel = require(path.join(__dirname, "Models", 'coinModel.js'));
require('dotenv').config();

// url for fetch
const url = process.env.QUERY_URI;
const apiKey = process.env.API_KEY; 

// fetch data and store it in database for node-cron
const fetchAndStore = async () => {
    try {
        const resp = await (await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`, 
            }
        })).json();

        resp.forEach(async (data) => {
            let savingName = data.name.toLowerCase();

            // the name of matic is polygon in the API, handling that
            if (savingName === "polygon") {
                savingName = "matic";
            }
            const coinData = new coinModel({
                name: savingName,
                price: parseFloat(data.current_price, 10),
                marketCap: parseFloat(data.market_cap, 10),
                change24h: parseFloat(data.price_change_24h, 10),
            });
            await coinData.save();
        })
    }
    catch (error) {
        console.log('An error occurred ', error);
    }
}

// setting the time limit * * * * * => min hours day month day
module.exports.schedulerInit = () => { node_cron.schedule("* * * * *", fetchAndStore); }

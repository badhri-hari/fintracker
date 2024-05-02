const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/news/api", async (req, res) => {
  const url =
    "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=b266cda774ad470d9f25539f67b7d2cc";
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error in NewsAPI request:", error);
    res.status(500).send("Error in processing your request");
  }
});

app.get("/currencies/api", async (req, res) => {
  const headers = {
    apikey: "W9r08EoZMljWdvz0CjFTBpVSzJGgbijO",
  };

  try {
    const response = await axios.get(
      "https://api.apilayer.com/exchangerates_data/symbols",
      { headers }
    );
    const symbols = response.data.symbols;
    const formattedSymbols = Object.entries(symbols).map(([code, name]) => ({
      code,
      name,
    }));
    res.json(formattedSymbols);
  } catch (error) {
    console.error("Error in currencies request:", error);
    res.status(500).send("Error in processing your request");
  }
});

app.get("/stocks/api", async (req, res) => {
  const symbol = req.query.symbol;
  const apiKey = "W6CK1Q3E47ZVO1A7";
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data["Time Series (Daily)"];
    const latestDate = Object.keys(data)[0];
    const latestClose = parseFloat(data[latestDate]["4. close"]);
    const previousClose = parseFloat(data[Object.keys(data)[1]]["4. close"]);

    const status =
      latestClose > previousClose
        ? "up"
        : latestClose < previousClose
        ? "down"
        : "unchanged";

    res.json({ symbol, latestClose, status });
  } catch (error) {
    console.error("Error in AlphaVantage stock request:", error);
    res.status(500).send("Error in processing your request");
  }
});

app.get("/forex/api", async (req, res) => {
  const from_currency = req.query.from_currency;
  const to_currency = req.query.to_currency;
  const apiKey = "W6CK1Q3E47ZVO1A7";
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_currency}&to_currency=${to_currency}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data["Realtime Currency Exchange Rate"];
    const from_currency_code = data["1. From_Currency Code"];
    const to_currency_code = data["3. To_Currency Code"];
    const from_currency_name = data["2. From_Currency Name"];
    const to_currency_name = data["4. To_Currency Name"];
    const exchange_rate = Number(data["5. Exchange Rate"]).toFixed(2);

    res.json({
      exchange_rate,
      from_currency_code,
      from_currency_name,
      to_currency_code,
      to_currency_name,
    });
  } catch (error) {
    console.error("Error in AlphaVantage forex request:", error);
    res.status(500).send("Error in processing your request");
  }
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});

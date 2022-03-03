const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var DB = {
  games: [
    { id: 23, title: "ddddddd", year: 1524, price: 100 },
    { id: 65, title: "aaaaa", year: 1834, price: 80 },
    { id: 2, title: "cccccc", year: 2021, price: 90 },
  ],
};
var maxId = 100;

app.get("/games", (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.get("/game/:id", (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    const game = DB.games.find((game) => game.id == parseInt(id));
    if (game) {
      res.statusCode = 200;
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  }
});

app.post("/game", (req, res) => {
  const { title, year, price } = req.body;

  maxId++;
  const newGame = { id: maxId, title, year, price };
  DB.games.push(newGame);
  res.statusCode = 200;
  res.sendStatus(200);
});

app.delete("/game/:id", (req, res) => {
  let { id } = req.params;
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    id = parseInt(id);
    if (id < 1) {
      res.sendStatus(404);
    }
    DB.games = DB.games.filter((game) => game.id !== id);
    res.sendStatus(200);
  }
});

app.put("/game/:id", (req, res) => {
  let { id } = req.params;
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    id = parseInt(id);
    if (id < 1) {
      res.sendStatus(404);
    }
    let { title, year, price } = req.body;
    const game = DB.games.find((game) => game.id === id);

    if (game) {
      if (title) {
        game.title = title;
      }
      if (year) {
        game.year = year;
      }
      if (price) {
        game.price = price;
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.listen(45678, () => {
  console.log("API RODADNO");
});

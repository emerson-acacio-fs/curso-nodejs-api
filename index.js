const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

const JWT_SECRET_KEY =
  "ASASghdskjdbfjsdhbfjhehbueyuhuwwoijkokldfndvjdfhjuihgtçpewpijuoi";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next) {
  const authToken = req.headers["authorization"];
  if (authToken) {
    const token = authToken.split(" ")[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
      if (err) {
        res.status(400);
        res.json({ errors: [{ message: "Token invalido" }] });
      } else {
        req.loggedUser = { ...data };
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ errors: [{ message: "Token inválido" }] });
  }
}

var DB = {
  games: [
    { id: 23, title: "ddddddd", year: 1524, price: 100 },
    { id: 65, title: "aaaaa", year: 1834, price: 80 },
    { id: 2, title: "cccccc", year: 2021, price: 90 },
  ],
  users: [
    {
      id: 1,
      name: "Emerson",
      email: "emerson@hotmail.com",
      password: "123456",
    },
    {
      id: 2,
      name: "Acácio",
      email: "acacio@hotmail.com",
      password: "123456",
    },
  ],
};
var maxId = 100;

app.get("/games", auth, (req, res) => {
  res.statusCode = 200;
  res.json({ user: req.loggedUser, games: DB.games });
});

app.get("/game/:id", auth, (req, res) => {
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

app.post("/game", auth, (req, res) => {
  const { title, year, price } = req.body;

  maxId++;
  const newGame = { id: maxId, title, year, price };
  DB.games.push(newGame);
  res.statusCode = 200;
  res.sendStatus(200);
});

app.delete("/game/:id", auth, (req, res) => {
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

app.put("/game/:id", auth, (req, res) => {
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

app.post("/auth", (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const user = DB.users.find((user) => user.email === email);
    if (user) {
      if (user.password === password) {
        jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET_KEY,
          {
            expiresIn: "4h",
          },
          (err, token) => {
            if (err) {
              res.status(400);
              res.json({ errors: [{ message: "falha na geração do token" }] });
            } else {
              res.status(200);
              res.json({ token });
            }
          }
        );
      } else {
        res.status(401);
        res.json({ errors: [{ message: "Senha inválida" }] });
      }
    } else {
      res.status(404);
      res.json({ errors: [{ message: "Usuário não existe" }] });
    }
  } else {
    res.status(400);
    res.json({ errors: [{ message: "e-mail ou(e) senha inválido(s)" }] });
  }
});

app.listen(45678, () => {
  console.log("API RODADNO");
});

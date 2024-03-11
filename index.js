const express = require("express");
const methodOverride = require("method-override");
const app = express();
const { faker } = require("@faker-js/faker");
const path = require("path");

let PORT = 3000;
miscs();
function miscs() {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
}
app.use(methodOverride("_method"));

//Data generator
function theUser() {
  return {
    user_id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profile: faker.image.avatar(),
  };
}

let data = [];
for (let i = 1; i <= 20; i++) {
  data.push(theUser());
}

//Users
app.get("/users", (req, res) => {
  let users = data;
  res.render("users", { users });
});

//Users/view
app.get("/users/:id/view", (req, res) => {
  let { id } = req.params;
  let user = data.filter((u) => id === u.user_id);
  res.render("view.ejs", { user });
});

//Users/add
app.get("/users/add", (req, res) => {
  res.render("add.ejs");
});

let genUser = () => {
  return [faker.string.uuid()];
};

app.post("/users", (req, res) => {
  let { user, mail, pass, picture } = req.body;
  let func = genUser();
  let newUser = {
    user_id: func[0],
    username: user,
    email: mail,
    password: pass,
    profile: picture,
  };
  data.push(newUser);
  res.redirect("/users");
});

//Users/edit
app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  let user = data.filter((u) => id === u.user_id);
  res.render("edit.ejs", { user });
});

app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let newName = req.body.username;
  let user = data.filter((u) => id === u.user_id);
  if (user[0].password === password) {
    user[0].username = newName;
    res.redirect("/users");
  } else {
    res.render("wrong.ejs");
  }
});

//delete/:id
app.delete("/users/:id", (req, res) => {
  let { id } = req.params;
  let users = data.filter((u) => id !== u.user_id);
  data = users;
  res.redirect("/users");
});

app.listen(PORT, (req, res) => {
  console.log(`You're on PORT ${PORT}`);
});

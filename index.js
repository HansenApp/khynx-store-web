const app = require("express")();
const bodyParser = require("body-parser");
const expressEjsLayouts = require("express-ejs-layouts");

let auth = false;
let username_ = false;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(expressEjsLayouts);

app.set("view engine", "ejs");
app.set("layout", "./layouts/main.ejs");

app.get("/", function (req, res) {
    res.render("index", {
        title: "Home"
    });
});

app.get("/store", function (req, res) {
    res.render("store", {
        title: "Store",
        auth: auth
    });
});

app.get("/login", function (req, res) {
    if (auth != false) {
        return res.send("You has loggined");
    }
    res.render("login", {
        title: "Login"
    });
});

app.post("/login", function (req, res) {
    const { username, password } = req.body;

    const user = require("./users.json");

    user.forEach(u => {
        if (u.name == username && u.password == password) {
            auth = true;
            username_ = username;
            res.redirect("/");
        }
    })
});

app.get("/cart/my", function (req, res) {
    if (!auth) return res.send("Please login first <a href='/login'>Click here!</a>");
    res.render("myCart", {
        title: "My Cart",
        cart: require("./cart.json").filter(val => val.user == username_)
    })
});

app.get("/cart/add", function (req, res) {
    if (req.query.id === "0") {
        require("./cart.json").push({
            name: "Setup discord server",
            user: username_,
            count: "1"
        });
        res.redirect("/cart/my")
    }
});

app.get("/logout", function (req, res) {
    auth = false;
    username_ = false;

    res.json("Successfully");
});

app.get("/checkout", function (req, res) {
    require("./cart.json").splice(require("./cart.json").findIndex((v, i, obj) => v.user == username_));
    return res.redirect('/cart/my');
})


app.listen(8000);
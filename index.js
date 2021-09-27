import express from "express";
import user from "./routes/api/controllers/user/index.js";
import {cart} from "./routes/api/controllers/orders/index.js";
import {
  product,
  category,
  item,
} from "./routes/api/controllers/inventory/index.js";

const app = express();

//In it middleware
app.use(express.json()); // this allows us to take request.body data

// Defining Routes
app.use("/api/user", user);
app.use("/api/category", category);
app.use("/api/products", product);
app.use("/api/item", item);
app.use("/api/cart", cart);

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port no ${PORT}`));


// user
// add user to db
// validate user credentials
// generate token payload


// http status codes constant
// naming convention
// if statements in category...

import axios from "axios";

import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "root",
  database: "inventory",
});

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getInventoryProducts() {
  try {
    const query = `select productid,seller_id from inventory.public.item i ;`;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getToken(email, password) {
  const URL = `http://localhost:3000/api/user/login`;
  try {
    const a = await axios.post(URL, { email, password });
    return a.data.token;
  } catch (error) {
    console.log(error);
  }
}

async function addItemsToCart() {
  const URL = `http://localhost:3000/api/cart/add`;
  const products = await getInventoryProducts();
  console.log(products);
  for (let i = 0; i < 70; i += 2) {
    const token = await getToken(`zain80776${i}@gmail.com`, "Zainahmad0@");
    let config = {
      headers: {
        "x-auth-token": token,
      },
    };
    for (let j = 0; j < products.length; j++) {
      const data = {
        productId: products[j].productid,
        quantity: randomIntFromInterval(1, 3),
        sellerId: products[j].seller_id,
      };
      console.log(data)
      try {
        const a = await axios.post(URL, data, config);
        console.log(a.data);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function checkoutOrder() {
  const URL = `http://localhost:3000/api/order/checkout`;
  for (let i = 0; i < 60; i += 2) {
    const token = await getToken(`zain80776${i}@gmail.com`, "Zainahmad0@");
    let config = {
      headers: {
        "x-auth-token": token,
      },
    };
    try {
      const a = await axios.post(URL,{}, config);
      console.log(a.data);
    } catch (error) {
      console.log(error);
    }
  }
}

await checkoutOrder();
await console.log("OK");

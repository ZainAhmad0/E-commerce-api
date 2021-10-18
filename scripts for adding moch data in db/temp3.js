import axios from "axios";

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
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

async function getProducts(categoryId) {
  const URL = `http://localhost:3000/api/products/category/${categoryId}`;
  try {
    const a = await axios.get(URL);
    return a.data;
  } catch (error) {
    console.log(error);
  }
}

async function addItem(data, token) {
  const URL = `http://localhost:3000/api/item/update`;
  let config = {
    headers: {
      "x-auth-token": token,
    },
  };
  try {
    const a = await axios.patch(URL, data, config);
    console.log(a.data);
  } catch (error) {
    console.log(error);
  }
}

async function abc() {
  const catId = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  for (let j = 1; j < 70; j += 2) {
    for (let i = 0; i < 10; i++) {
      const products = await getProducts(catId[i]);
      const length = products.length;
      const productID = products[randomIntFromInterval(0, length)].id;
      const token = await getToken(`zain80776${j}@gmail.com`, "Zainahmad0@");
      const data = {
        productId: productID,
        quantity: 100,
      };
      await addItem(data, token);
    }
  }
}

await abc();

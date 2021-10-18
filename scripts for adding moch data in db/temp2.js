import axios from "axios";

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const catId = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
async function addFakeProductsToDB() {
  const URL = `http://localhost:3000/api/products`;
  let config = {
    headers: {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxMDMyOGU2Yi05NjRiLTQ3NzQtYjcxMy1iMDcwZmNjMjJkYTIiLCJyb2xlSWQiOjIsImlhdCI6MTYzMzY0NDMxMSwiZXhwIjoxNjMzNjkwMzExfQ._nPmDtrQEfuq0oTfZfP4XNbVCNGpEBL1lQVraVeEFPQ",
    },
  };

  for (let i = 0; i < 10000; i++) {
    const data = {
      category_id: catId[randomIntFromInterval(0, 9)],
      title: `Product-${i}`,
      picture: "A",
      price: `${randomIntFromInterval(100, 1000000)}`,
      summary: "Abc",
      active: "true",
    };

    try {
      const a = await axios.post(URL, data, config);
      console.log(a.data);
    } catch (error) {
      console.log(error);
    }
  }
}

await addFakeProductsToDB();
await console.log("OK");

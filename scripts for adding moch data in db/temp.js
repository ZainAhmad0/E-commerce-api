import axios from "axios";

async function addFakeUsersToDB() {
  const URL = `http://localhost:3000/api/user/signup`;
  for (let i = 0; i < 500; i++) {
    //   const roleP= i%2 ? "Buyer" : "Seller"
    const data = {
      role: i % 2 === 0 ? "Buyer" : "Seller",
      firstName: `Zain${i}`,
      middleName: `Ahmad${i}`,
      lastName: `Khan${i}`,
      mobile: `1234567890${i}`,
      email: `zain80776${i}@gmail.com`,
      password: "Zainahmad0@",
      repeat_password: "Zainahmad0@",
      profile: `sdaofhlknsdf${i}`,
      present_address: `HIT${i}`,
      permanent_address: `FSD${i}`,
      city: `Taxila${i}`,
      province: "Punjab",
      country: "Pakistan",
    };
    console.log(data);
    try {
      const a = await axios.post(URL, data);
      console.log(a);
    } catch (error) {
      console.log(error);
    }
  }
}

await addFakeUsersToDB();
await console.log("OK");

// async function updateInventory(token, cartItems) {
//     let config = {
//       headers: {
//         "x-auth-token": token,
//       },
//     };
//     const URL = `http://localhost:3000/api/item/buy`;
//     for (let i = 0; i < cartItems.length; i++) {
//       const data = {
//         productId: cartItems[i].product_id,
//         quantity: cartItems[i].quantity,
//       };
//       try {
//         await axios.patch(URL, data, config);
//       } catch (error) {}
//     }
//   }

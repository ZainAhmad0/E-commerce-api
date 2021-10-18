import app from "../index.js";
import chai from "chai";
import chaiHttp from "chai-http";
// http status codes
import { StatusCodes } from "http-status-codes";

// middleware
chai.use(chaiHttp);

const { expect } = chai;

const user = {
  role: "Seller",
  firstName: "Zain",
  middleName: "Ahmad",
  lastName: "Khan",
  mobile: "0316502138961",
  email: "zain80776@gmail.com",
  password: "Zainahmad0@",
  repeat_password: "Zainahmad0@",
  profile: "sdaofhlknsdf",
  present_address: "HIT",
  permanent_address: "HIT",
  city: "Taxila",
  province: "Punjab",
  country: "Pakistan",
};

describe("User login route end to end test", () => {
  it("should return login token to the user when a user hits signup route with his info", (done) => {
    chai
      .request(app)
      .post("http://localhost:3000/api/user/signup")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(user)
      .end((err, response) => {
        if (err) {
          done(err);
        } else {
          expect(response).to.be.an("object").that.does.include("token");
          chai
            .request(app)
            .post("http://localhost:3000/api/user/signup")
            .set("content-type", "application/x-www-form-urlencoded")
            .send(user)
            .end(function (error, response) {
              if (error) {
                done(error);
              } else {
                // error that user already exsists
                expect(response).to.be.an("object").that.does.include("error");
                expect(response).does.have.statusCode(StatusCodes.BAD_REQUEST);
              }
            });
        }
      });
  });
});

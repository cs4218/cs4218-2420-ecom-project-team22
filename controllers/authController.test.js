import { jest } from "@jest/globals";
import { registerController, loginController } from "./authController";
import userModel from "../models/userModel";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";


jest.mock("../models/userModel.js");


jest.mock("../helpers/authHelper.js", () => ({
 comparePassword: jest.fn(),
 hashPassword: jest.fn(),
}));


jest.mock("jsonwebtoken", () => ({
 sign: jest.fn(),
}));


describe("Register Controller Test", () => {
 let req, res;


 beforeEach(() => {
   jest.clearAllMocks();
   req = {
     body: {
       name: "John Doe",
       email: "invalid-email",
       password: "password123",
       phone: "12344000",
       address: "123 Street",
       answer: "Football",
     },
   };


   res = {
     status: jest.fn().mockReturnThis(),
     send: jest.fn(),
   };
 });


 test("user model is not saved for invalid email", async () => {
   // specify mock functionality
   userModel.findOne = jest.fn().mockResolvedValue(null);
   userModel.prototype.save = jest.fn();


   await registerController(req, res);
   expect(userModel.prototype.save).not.toHaveBeenCalled();
 });
});


describe("Login Controller Test", () => {
 const mockUser = {
   _id: "65b8d8f4c3a1b98765432101",
   name: "John Doe",
   email: "johndoe@example.com",
   password: "hashedpassword",
   phone: "123456789",
   address: { city: "NYC", country: "USA" },
   answer: "securityAnswer",
   role: 0,
 };
 let req, res;


 beforeEach(() => {
   jest.clearAllMocks();
   req = {
     body: {
       email: "johndoe@example.com",
       password: "password123",
     },
   };


   res = {
     status: jest.fn().mockReturnThis(),
     send: jest.fn(),
     json: jest.fn(),
   };
 });


 test("succesfull login", async () => {
   // all the Mocked function calls to dependencies
   userModel.findOne =  jest.fn().mockResolvedValue(mockUser);
   comparePassword.mockResolvedValue(true);
   JWT.sign.mockReturnValue("mocked-jwt-token");
   await loginController(req, res);


   expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
   expect(comparePassword).toHaveBeenCalledWith("password123", mockUser.password);
   expect(JWT.sign).toHaveBeenCalledWith({ _id: mockUser._id }, process.env.JWT_SECRET, {
     expiresIn: "7d",
   });


   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: true,
       message: "login successfully",
       user: expect.objectContaining({
         _id: mockUser._id,
         name: mockUser.name,
         email: mockUser.email,
         role: mockUser.role,
       }),
       token: "mocked-jwt-token",
     })
   );
 });


 test("email is not registered", async () => {
   // all the Mocked function calls to dependencies
   userModel.findOne =  jest.fn().mockResolvedValue(null);
   await loginController(req, res);


   expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Email is not registerd",
     })
   );
 });




 test("wrong password", async () => {
   // all the Mocked function calls to dependencies
   userModel.findOne =  jest.fn().mockResolvedValue(mockUser);
   comparePassword.mockResolvedValue(false);
   await loginController(req, res);


   expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
   expect(comparePassword).toHaveBeenCalledWith("password123", mockUser.password);


   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Invalid Password",
     })
   );
 });




 test("email is missing", async () => {
   // all the Mocked function calls to dependencies
   req = { email: "", password: "password123",};
 
   await loginController(req, res);


   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Invalid email or password",
     })
   );
 });




 test("email is invalid", async () => {
   // all the Mocked function calls to dependencies
   req = { email: "dbcjwhbdncj", password: "password123",};
 
   await loginController(req, res);


   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Invalid email or password",
     })
   );
 });


 test("password is missing", async () => {
   // all the Mocked function calls to dependencies
   req = { email: "johndoe@example.com", password: "",};
 
   await loginController(req, res);


   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Invalid email or password",
     })
   );
 });








});




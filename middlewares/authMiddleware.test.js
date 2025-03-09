import { jest } from "@jest/globals";
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { requireSignIn, isAdmin } from "./authMiddleware.js";
import { is } from "date-fns/locale/is";


jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
   }));
   
jest.mock("../models/userModel.js");

describe("isAdmin", ()=>{
    let req, res, next;


    const mockUser = {
        _id: "65b8d8f4c3a1b98765432101",
        name: "John Doe",
        email: "johndoe@example.com",
        password: "hashedpassword",
        phone: "123456789",
        address: { city: "NYC", country: "USA" },
        answer: "securityAnswer",
        role: 1,
    };

    const mockUserUnauthorized = {
        _id: "29390283913212",
        name: "Doe",
        email: "doe@example.com",
        password: "hashedpassword",
        phone: "123232128",
        address: { city: "NYC", country: "USA" },
        answer: "securityAnswer",
        role: 0,
    };

    beforeEach(() => {
        req = { headers: {authorization:{}} , 
                user: mockUser };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            };
        next = jest.fn(); 
    });

    test("isAdmin success", async () => {
        userModel.findById = jest.fn().mockResolvedValue(mockUser);
        await isAdmin(req,res,next);
        expect(userModel.findById).toHaveBeenCalledWith(req.user._id);
        expect(next).toHaveBeenCalled();
        
    });


    test("isAdmin id does not exist", async () => {
        userModel.findById = jest.fn().mockResolvedValue(null);
        await isAdmin(req,res,next);
        expect(userModel.findById).toHaveBeenCalledWith(req.user._id);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "User not found",
            })
        );
        
    });


    test("isAdmin catch error", async () => {
        console.log = jest.fn();
        const error = new Error("Test error");
        userModel.findById = jest.fn().mockImplementation(() => { throw error });
        await isAdmin(req,res,next);
        expect(console.log).toHaveBeenCalledWith(error);
        expect(userModel.findById).toHaveBeenCalledWith(req.user._id);
        expect(next).not.toHaveBeenCalled();


        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "Error in admin middleware",
            })
        );
        
    });

    test("isAdmin unAuthorizedAccess", async () => {
        req.user = mockUserUnauthorized;
        userModel.findById = jest.fn().mockResolvedValue(mockUserUnauthorized);
        await isAdmin(req,res,next);
        expect(userModel.findById).toHaveBeenCalledWith(req.user._id);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "UnAuthorized Access",
            })
        );
            
    });
});

describe("requireSignIn", () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {authorization:{}} , 
                user: {_id: 0, name: "Initil Name" }}; 
        res = {};
        next = jest.fn(); 
    });
    test("requireSignIn success", async () => {
        const decodedToken = { _id: 123, name: "John Doe" };
        req.headers.authorization = "token";
        JWT.verify.mockReturnValue(decodedToken);
        
        await requireSignIn(req, res, next);

        expect(JWT.verify).toHaveBeenCalledWith(req.headers.authorization, process.env.JWT_SECRET);
        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual(decodedToken);
    });
  
    test("should throw an error if verify fails", async () => {
        const currUser = req.user;
        console.log = jest.fn();
        const error = new Error("Test error");
        req.headers.authorization = "token";
        JWT.verify.mockImplementation(() => { throw error });
  
        try{
            await requireSignIn(req, res, next);
        } catch(e){

        }
        expect(JWT.verify).toHaveBeenCalledWith(req.headers.authorization, process.env.JWT_SECRET);
        expect(console.log).toHaveBeenCalledWith(error);
        expect(next).not.toHaveBeenCalled();
        expect(req.user).toEqual(currUser);
    });
  });
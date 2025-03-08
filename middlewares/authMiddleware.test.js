import { jest } from "@jest/globals";
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { requireSignIn } from "./authMiddleware.js";


jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
   }));
   

describe("requireSignIn", () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {authorization:{}} , 
                user: {userId: 0, name: "Initil Name" }}; 
        res = {};
        next = jest.fn(); 
    });
    test("requireSignIn success", async () => {
        const decodedToken = { userId: 123, name: "John Doe" };
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
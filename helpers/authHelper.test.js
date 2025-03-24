import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import { hashPassword , comparePassword} from "./authHelper";

describe("hashPassword", () => {
    test("should return a hashed password", async () => {
        const password = "mySecurePassword123";
        const hashedValue = "mockHashedPassword";
        jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedValue);
    
        const result = await hashPassword(password);
    
        expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number));
        expect(result).toBe(hashedValue);
    });
  
    test("should throw an error if hashing fails", async () => {
        console.log = jest.fn();
        const error = new Error("Test error");
        const password = "mySecurePassword123";

        jest.spyOn(bcrypt, "hash").mockRejectedValue(error);
  
        try{
            await hashPassword(password);
        } catch(e){

        }
        expect(console.log).toHaveBeenCalledWith(error);
    });
  });


describe("comparePassword", () => {
test("password and hash are the same", async () => {
    const password = "mySecurePassword123";
    const hashedPassword = "correctmockHashedPassword";

    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const result = await comparePassword(password, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(true);
});

test("password and hash are different", async () => {
    const password = "mySecurePassword123";
    const hashedPassword = "wrongmockHashedPassword";

    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
    
    const result = await comparePassword(password, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(false);
});


test("should throw an error if compare fails", async () => {
    console.log = jest.fn();
    const error = new Error("Test error");
    const password = "mySecurePassword123";
    const hashedPassword = "correctmockHashedPassword";

    jest.spyOn(bcrypt, "compare").mockRejectedValue(error);

    try{
        await comparePassword(password, hashedPassword);
    } catch(e){

    }
    expect(console.log).toHaveBeenCalledWith(error);
});
});
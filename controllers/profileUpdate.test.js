import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/userModel.js";
import { updateProfileController } from "./authController.js";
import { hashPassword } from "../helpers/authHelper.js"; 

jest.mock("../helpers/authHelper.js", () => ({
    hashPassword: jest.fn(),
}));

let mongoServer;

describe("Profile Update Integration Tests", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should update profile successfully", async () => {
    // Step 1: Create a test user in the actual database
    const testUser = await User.create({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "oldpassword",
      phone: "1234567890",
      address: "456 Another St",
      answer: "Basketball",
    });

    // Step 2: Mock request and response objects
    const req = {
      user: { _id: testUser._id },
      body: {
        name: "Jane Smith",
        email: "janesmith@example.com",
        password: "newpassword",
        phone: "0987654321",
        address: "123 Main St",
      },
    };

    const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

    hashPassword.mockResolvedValue("hashedPassword");

    // Step 3: Call the updateProfile function
    await updateProfileController(req, res);

    // Step 4: Fetch updated user from database
    const updatedUser = await User.findById(testUser._id);

    // Step 5: Assertions
    expect(updatedUser.name).toBe("Jane Smith");
    expect(updatedUser.password).toBe("hashedPassword");
    expect(updatedUser.phone).toBe("0987654321");
    expect(updatedUser.address).toBe("123 Main St");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser: expect.objectContaining({
        name: "Jane Smith",
        phone: "0987654321",
        address: "123 Main St",
      }),
    });
  });

  it("should return error if password is less than 6 characters", async () => {
    const testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "oldpassword",
      phone: "1234567890",
      address: "Old Address",
      answer: "Soccer",
    });

    const req = {
      user: { _id: testUser._id },
      body: { password: "123" }, // Short password
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateProfileController(req, res);
    console.log(res.status.mock.calls); // Debugging line
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error: "Password must be at least 6 characters long",
      });      
    
  });

  it("should return 400 if user is not found", async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() }, // Random non-existing user ID
      body: { email: "newemail@example.com", address: "New Address" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateProfileController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
        error: "The provided user ID does not exist",
      });      
  });
});

import { jest } from "@jest/globals";
import { updateProfileController } from "../controllers/authController";
import userModel from "../models/userModel";
import { hashPassword } from "../helpers/authHelper.js";

jest.mock("../models/userModel", () => ({
    findById: jest.fn().mockImplementation((id) =>
        Promise.resolve(
            id === "65b8d8f4c3a1b98765432101"
                ? { _id: id, address: "123 Main St", answer: "Soccer" }
                : null
        )
    ),
    findByIdAndUpdate: jest.fn().mockResolvedValue({
        _id: "65b8d8f4c3a1b98765432101",
        name: "Jane Smith",
        address: "123 Main St",
        answer: "Soccer",
    }),
}));

jest.mock("../helpers/authHelper.js", () => ({
    comparePassword: jest.fn(),
    hashPassword: jest.fn(),
}));

describe("updateProfileController", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            user: { _id: "65b8d8f4c3a1b98765432101" }, 
            body: {
                name: "Jane Smith",
                email: "janesmith@example.com",
                password: "123password",
                phone: "0987654321",
                address: "123 Main St",
                answer: "Soccer",
            },
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it("should update profile successfully", async () => {
        const mockUser = {
            _id: "65b8d8f4c3a1b98765432101",
            name: "Jane Doe",
            email: "janedoe@example.com",
            password: "oldpassword",
            phone: "1234567890",
            address: "456 Another St",
            answer: "Basketball",
        };

        const mockUpdatedUser = {
            ...mockUser,
            name: "Jane Smith",
            email: "janesmith@example.com",
            password: "hashedPassword",
            phone: "0987654321",
            address: "123 Main St",
            answer: "Soccer",
        };

        userModel.findById.mockResolvedValue(mockUser);
        hashPassword.mockResolvedValue("hashedPassword");
        userModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

        await updateProfileController(req, res);

        expect(userModel.findById).toHaveBeenCalledWith("65b8d8f4c3a1b98765432101");
        expect(hashPassword).toHaveBeenCalledWith("123password");
        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "65b8d8f4c3a1b98765432101",
            {
                name: "Jane Smith",
                password: "hashedPassword",
                phone: "0987654321",
                address: "123 Main St",
            },
            { new: true }
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: "Profile Updated Successfully",
                updatedUser: mockUpdatedUser,
            })
        );
    });
    
    it("should return an error if password is too short", async () => {
        const mockUser = {
            _id: "65b8d8f4c3a1b98765432101",
            name: "Jane Doe",
            email: "janedoe@example.com",
            password: "oldpassword",
            phone: "1234567890",
            address: "456 Another St",
            answer: "Basketball",
        };
    
        const mockUpdatedUser = {
            ...mockUser,
            name: "Jane Smith",
            email: "janesmith@example.com",
            password: "hashedPassword",
            phone: "0987654321",
            address: "123 Main St",
            answer: "Soccer",
        };
    
        userModel.findById.mockResolvedValue(mockUser);
        hashPassword.mockResolvedValue("hashedPassword");
        userModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);
    
    
        jest.clearAllMocks();
        req.body.password = "123"; // Too short password
    
        await updateProfileController(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Password is required and must be at least 6 characters long",
        });
    
    });
       

    it("should return 400 if user is not found", async () => {
        userModel.findById.mockResolvedValue(null); // Simulate user not found
    
        await updateProfileController(req, res);
    
        expect(userModel.findById).toHaveBeenCalledWith(req.user._id); // Ensure correct ID is queried
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "User not found"
            })
        );
    });
    
    it("should return 400 on database error", async () => {
        userModel.findById.mockImplementation(() => Promise.reject(new Error("Database error")));
    
        await updateProfileController(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "Error While Updating Profile"
            })
        );
    });
    
});
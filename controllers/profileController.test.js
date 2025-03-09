import { jest } from "@jest/globals";
import { updateProfileController } from "../controllers/authController";
import userModel from "../models/userModel";
import { hashPassword } from "../helpers/authHelper.js";

jest.mock("../models/userModel");
jest.mock("../helpers/authHelper.js", () => ({
    comparePassword: jest.fn(),
    hashPassword: jest.fn(),
}));

describe("updateProfileController", () => {
    let req, res;

    beforeEach(() => {
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
        expect(res.send).toHaveBeenCalledWith({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser: mockUpdatedUser,
        });
    });

    it("should return error if password is less than 6 characters", async () => {
        req.body.password = "123"; 

        await updateProfileController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            error: "Passsword is required and 6 character long",
        });

        expect(userModel.findById).not.toHaveBeenCalled();
    });

    it("should return 400 if user is not found", async () => {
        userModel.findById.mockResolvedValue(null);

        await updateProfileController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Error While Update profile",
            error: expect.anything(),
        });
    });

    it("should return 400 on database error", async () => {
        userModel.findById.mockImplementation(() => {
            throw new Error("Database error");
        });

        await updateProfileController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: "Error While Update profile" })
        );
    });
});
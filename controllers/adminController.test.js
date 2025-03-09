import { adminGetUsersController } from "../controllers/authController";
import userModel from "../models/userModel";
import { jest } from "@jest/globals";

jest.mock("../models/userModel");

describe("adminGetUsersController", () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { _id: "admin123", role: 1 }, 
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it("should allow admin to retrieve all users", async () => {
        const mockUsers = [
            { _id: "user1", name: "Alice Johnson", email: "alice@example.com", role: 0 },
            { _id: "user2", name: "Bob Smith", email: "bob@example.com", role: 0 },
        ];

        userModel.find.mockResolvedValue(mockUsers);

        await adminGetUsersController(req, res);

        expect(userModel.find).toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, users: mockUsers });
    });

    it("should return 403 if non-admin tries to retrieve users", async () => {
        req.user.role = 0; // Non-admin user

        await adminGetUsersController(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Access denied. Admins only.",
        });

        expect(userModel.find).not.toHaveBeenCalled();
    });

    it("should return 500 if database error occurs", async () => {
        userModel.find.mockImplementation(() => {
            throw new Error("Database error");
        });

        await adminGetUsersController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: "Error retrieving users" })
        );
    });
});

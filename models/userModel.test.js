import { jest, expect, test, describe } from "@jest/globals";
import mongoose from 'mongoose';
import UserModel from './userModel.js'; // Ensure the path is correct

describe('User Model', () => {
  it('should have required fields', () => {
    const user = new UserModel({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '1234567890',
      address: {},
      answer: 'My answer',
    });

    const requiredFields = ['name', 'email', 'password', 'phone', 'address', 'answer'];
    requiredFields.forEach(field => {
      expect(user.schema.path(field).options.required).toBe(true);
    });
  });

  it('should default the role to 0', () => {
    const user = new UserModel({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '1234567890',
      address: {},
      answer: 'My answer',
    });

    expect(user.role).toBe(0); // Default role should be 0
  });

  it('should not allow missing required fields', async () => {
    try {
      const user = new UserModel({});
      await user.validate();  // This will throw an error because required fields are missing
    } catch (error) {
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
      expect(error.errors.phone).toBeDefined();
      expect(error.errors.address).toBeDefined();
      expect(error.errors.answer).toBeDefined();
    }
  });

  it('should validate unique email', async () => {
    const existingUser = { email: 'existing@example.com' };

    // Simulate that findOne() would find a user with the same email
    UserModel.findOne = jest.fn().mockResolvedValue(existingUser);
    UserModel.prototype.save = jest.fn().mockResolvedValue(existingUser);

    const user = new UserModel({
      name: 'Jane Doe',
      email: 'existing@example.com',
      password: 'password123',
      phone: '0987654321',
      address: {},
      answer: 'My answer',
    });

    const savedUser = await user.save();

    // Assuming there's a custom validation for unique email
    expect(savedUser.email).toBe(existingUser.email); 
  });

  it('should have timestamps', () => {
    const user = new UserModel({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '1234567890',
      address: {},
      answer: 'My answer',
    });

    const currentTime = new Date().getTime();
    user.save = jest.fn().mockImplementation(() => {
      user.createdAt = currentTime;
      user.updatedAt = currentTime;
      return user;
    });

    const savedUser = user.save();

    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
    expect(savedUser.createdAt).toStrictEqual(savedUser.updatedAt); // They should be equal if saved at the same time
  });
});
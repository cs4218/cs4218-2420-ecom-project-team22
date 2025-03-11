import { jest, expect, test, describe } from "@jest/globals";
import mongoose from "mongoose";
import colors from "colors";
import connectDB from "./db";

describe("connectDB", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log success message when connection is successful", async () => {
    // Mock a successful connection
    mongoose.connect = jest.fn();
    mongoose.connect.mockResolvedValue({
      connection: { host: "localhost" },
    });

    await connectDB();

    // Check if the success message was logged
    expect(logSpy).toHaveBeenCalledWith(
      "Connected To Mongodb Database localhost".bgMagenta.white
    );
  });

  it("should log error message when connection fails", async () => {
    const errorMessage = "Connection failed";
    
    // Mock a failed connection
    mongoose.connect.mockRejectedValue(new Error(errorMessage));

    await connectDB();

    // Check if the error message was logged
    expect(logSpy).toHaveBeenCalledWith(
      `Error in Mongodb Error: ${errorMessage}`.bgRed.white
    );
  });
});

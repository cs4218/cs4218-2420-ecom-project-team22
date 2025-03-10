import mongoose from "mongoose";
import connectDB from "./db"; 

jest.mock("mongoose");
jest.mock("colors", () => ({
    bgMagenta: jest.fn().mockReturnValue({ white: jest.fn().mockReturnValue('colored text') }),
    bgRed: jest.fn().mockReturnValue({ white: jest.fn().mockReturnValue('colored text') }),
  }));  

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

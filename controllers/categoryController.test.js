import { jest } from "@jest/globals";
import { createCategoryController } from "./categoryController";
import categoryModel from "../models/categoryModel";

describe("Create Category Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  test("cannot create existing category that already exists", async () => {
    categoryModel.findOne = jest.fn().mockResolvedValue({
      name: "toiletries",
      slug: "toiletries",
    });
    categoryModel.prototype.save = jest.fn();

    req = {
      body: {
        name: "toiletries",
      },
    };

    await createCategoryController(req, res);
    expect(categoryModel.prototype.save).not.toHaveBeenCalled();
  });
});

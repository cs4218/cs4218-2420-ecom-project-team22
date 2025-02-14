import { jest, expect, test, describe } from "@jest/globals";
import { createCategoryController, updateCategoryController } from "./categoryController";
import categoryModel from "../models/categoryModel";
import slugify from "slugify";

jest.mock("../models/categoryModel.js");

describe("Create Category Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((data) => data),
    };
  });

  test("creating a new category works", async () => {
    categoryModel.findOne = jest.fn().mockResolvedValue(null);
    categoryModel.prototype.save = jest.fn();
    req = { body: { name: "clothing", slug: "clothing" } };

    await createCategoryController(req, res);

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );
  });

  test("cannot create existing category that already exists", async () => {
    categoryModel.findOne = jest.fn().mockResolvedValue({
      name: "toiletries",
      slug: "toiletries",
    });
    categoryModel.prototype.save = jest.fn();
    req = { body: { name: "toiletries", slug: "toiletries" } };

    await createCategoryController(req, res);
    expect(categoryModel.prototype.save).not.toHaveBeenCalled();
  });

  test("cannot create category with empty name", async () => {
    categoryModel.findOne = jest.fn();
    req = { body: { name: "" } };

    await createCategoryController(req, res);
    expect(categoryModel.findOne).not.toHaveBeenCalled();
  });

  test("cannot create category with undefined name", async () => {
    categoryModel.findOne = jest.fn();
    req = { body: {} };

    await createCategoryController(req, res);
    expect(categoryModel.findOne).not.toHaveBeenCalled();
  });
});

describe("Update Category Controller Tests", () => {
  let res, req;
  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((data) => data),
    };
  });

  test("updating an existing category resolves successfully", async () => {
    const mockUpdatedCategory = {
      name: "accessories",
      slug: slugify("accessories"),
    };

    req = {
      body: { name: "accessories" },
      params: { id: "123" },
    };
    categoryModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedCategory);

    await updateCategoryController(req, res);

    expect(categoryModel.findByIdAndUpdate).toBeCalledWith(
      req.params.id,
      expect.objectContaining({ name: req.body.name }),
      expect.objectContaining({ new: true })
    );

    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: true,
        category: mockUpdatedCategory,
      })
    );
  });

  test("updating a non-existent category results in an error", async () => {
    req = {
      body: { name: "clothing" },
      param: { id: "ABC" },
    };

    categoryModel.findByIdAndUpdate = jest.fn().mockReturnValue(null);

    await updateCategoryController(req, res);

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});

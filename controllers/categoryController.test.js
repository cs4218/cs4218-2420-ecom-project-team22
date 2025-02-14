import { jest, expect, test, describe } from "@jest/globals";
import {
  createCategoryController,
  updateCategoryController,
  categoryControlller,
  singleCategoryController,
  deleteCategoryCOntroller,
} from "./categoryController";
import categoryModel from "../models/categoryModel";
import slugify from "slugify";

jest.mock("../models/categoryModel.js");

describe("Create Category Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    jest.resetAllMocks();
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

    expect(res.status).toBeCalledWith(201);
    expect(res.send).toBeCalledWith(
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

  test("error in checking existing category is handled gracefully", async () => {
    categoryModel.findOne = jest.fn().mockRejectedValue(new Error("Database error"));
    console.log = jest.fn((data) => data);
    req = { body: { name: "health" } };

    await createCategoryController(req, res);
    expect(res.send).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });

  test("database error in saving category is handled gracefully", async () => {
    categoryModel.findOne = jest.fn().mockResolvedValue(null);
    categoryModel.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));
    console.log = jest.fn((data) => data);
    req = { body: { name: "health" } };

    await createCategoryController(req, res);
    expect(res.send).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});

describe("Update Category Controller Tests", () => {
  let res, req;
  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((data) => data),
    };
  });

  test("Updating an existing category resolves successfully", async () => {
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

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: true,
        category: mockUpdatedCategory,
      })
    );
  });

  test("updating a non-existent category results in a failed update", async () => {
    req = {
      body: { name: "clothing" },
      params: { id: "ABC" },
    };

    categoryModel.findByIdAndUpdate = jest.fn().mockReturnValue(null);

    await updateCategoryController(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});

describe("All Category Controller Tests", () => {
  let res, req;
  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((data) => data),
    };
  });

  test("All categories from database are returned", async () => {
    const mockCategories = [
      { name: "accessories", slug: slugify("accessories") },
      { name: "clothing", slug: slugify("clothing") },
    ];

    req = {};
    categoryModel.find = jest.fn().mockResolvedValue(mockCategories);

    await categoryControlller(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: true,
        category: mockCategories,
      })
    );
  });

  test("database error occurring in category retrieval is handled gracefully", async () => {
    req = {};
    console.log = jest.fn((data) => data);
    categoryModel.find = jest.fn().mockRejectedValue(new Error("Database error"));

    await categoryControlller(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});

describe("Single Category Controller Tests", () => {
  let res, req;
  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((data) => data),
    };
  });

  test("retrieved category is returned in response", async () => {
    const mockCategory = {
      name: "toiletries",
      slug: slugify("toiletries"),
    };
    req = {
      params: {
        slug: slugify("toiletries"),
      },
    };

    categoryModel.findOne = jest.fn().mockResolvedValue(mockCategory);

    await singleCategoryController(req, res);

    expect(res.status).toBeCalledWith(200);
    // The category from the db call is returned
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: true,
        category: mockCategory,
      })
    );
    // Returned category has the same slug as the request
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        category: expect.objectContaining({
          slug: req.params.slug,
        }),
      })
    );
  });

  test("retrieving non-existent category should result in an error", async () => {
    req = {
      params: {
        slug: "hippo",
      },
    };
    categoryModel.findOne = jest.fn().mockResolvedValue(null);

    await singleCategoryController(req, res);
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });

  test("database error in retrieving category is handled gracefully", async () => {
    req = {
      params: {
        slug: "toiletries",
      },
    };
    categoryModel.findOne = jest.fn().mockRejectedValue(new Error("database error"));

    await singleCategoryController(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});

describe("Delete Category Controller Tests", () => {
  let res, req;
  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((data) => data),
    };
  });

  test("valid delete results in success and returns with deleted category", async () => {
    const mockCategory = {
      name: "toiletries",
      slug: slugify("toiletries"),
    };
    req = {
      params: {
        id: "ABC",
      },
    };
    categoryModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockCategory);

    await deleteCategoryCOntroller(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: true,
        category: mockCategory,
      })
    );
  });

  test("deleting non-existent category results in error", async () => {
    req = {
      params: {
        id: "ABC",
      },
    };
    categoryModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await deleteCategoryCOntroller(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});

import { jest } from "@jest/globals";
import { registerController, loginController, forgotPasswordController, testController } from "./authController";
import userModel from "../models/userModel";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";


jest.mock("../models/userModel.js");


jest.mock("../helpers/authHelper.js", () => ({
 comparePassword: jest.fn(),
 hashPassword: jest.fn(),
}));


jest.mock("jsonwebtoken", () => ({
 sign: jest.fn(),
}));


describe("Test Controller Test", () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {
      name: "John Doe",
      email: "invalid-email",
      password: "password123",
      phone: "invalid-phone",
      address: "123 Street",
      answer: "Football",
    },};
    res = {
      send: jest.fn(), 
    };

  });
 
  test("Return Protected Routes", async () => {
    testController(req, res);
    expect(res.send).toHaveBeenCalledWith("Protected Routes");
  });

  test("Error", async () => {
    console.log = jest.fn();
    
    const error = new Error("Test error");
    res.send.mockImplementation(() => {
      throw error;
    });

    try {
      testController(req,res);
    } catch (e) {
    }

    expect(console.log).toHaveBeenCalledWith(error);
    expect(res.send).toHaveBeenCalledWith({ error });
  });
});


describe("Register Controller Test", () => {
 let req, res;

 const mockUser = {
  _id: "65b8d8f4c3a1b98765432101",
  name: "John Doe",
  email: "johndoe@example.com",
  password: "hashedpassword",
  phone: "123456789",
  address: { city: "NYC", country: "USA" },
  answer: "securityAnswer",
  role: 0,
};

 beforeEach(() => {
   jest.clearAllMocks();
   req = {
     body: {
       name: "John Doe",
       email: "invalid-email",
       password: "password123",
       phone: "invalid-phone",
       address: "123 Street",
       answer: "Football",
     },
   };


   res = {
     status: jest.fn().mockReturnThis(),
     send: jest.fn(),
   };
 });


 test("user model is not saved for invalid email", async () => {
   // specify mock functionality
   userModel.findOne = jest.fn().mockResolvedValue(null);
   userModel.prototype.save = jest.fn();


   await registerController(req, res);
   expect(userModel.prototype.save).not.toHaveBeenCalled();
 });


 test("user model is not saved for invalid phone", async () => {
  // specify mock functionality
  userModel.findOne = jest.fn().mockResolvedValue(null);
  userModel.prototype.save = jest.fn();


  await registerController(req, res);
  expect(userModel.prototype.save).not.toHaveBeenCalled();
});


test("user is already registered", async () => {
  req = {
    body: {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      phone: "123456789",
      address: "123 Street",
      answer: "Football",
    },
  };
  // specify mock functionality
  userModel.findOne = jest.fn().mockResolvedValue(mockUser);
  userModel.prototype.save = jest.fn();


  await registerController(req, res);

  expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
  expect(userModel.prototype.save).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(
    expect.objectContaining({
      success: false,
      message: "Already Register please login",
    })
  );
});

test("registered success", async () => {
  req = {
    body: {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      phone: "123456789",
      address: "123 Street",
      answer: "Football",
    },
  };
  // specify mock functionality
  userModel.findOne = jest.fn().mockResolvedValue(null);
  userModel.prototype.save = jest.fn();


  await registerController(req, res);
  expect(userModel.prototype.save).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.send).toHaveBeenCalledWith(
    expect.objectContaining({
      success: true,
      message: "User Register Successfully",
    })
  );
});
});


describe("Login Controller Test", () => {
 const mockUser = {
   _id: "65b8d8f4c3a1b98765432101",
   name: "John Doe",
   email: "johndoe@example.com",
   password: "hashedpassword",
   phone: "123456789",
   address: { city: "NYC", country: "USA" },
   answer: "securityAnswer",
   role: 0,
 };
 let req, res;


 beforeEach(() => {
   jest.clearAllMocks();
   req = {
     body: {
       email: "johndoe@example.com",
       password: "password123",
     },
   };


   res = {
     status: jest.fn().mockReturnThis(),
     send: jest.fn(),
     json: jest.fn(),
   };
 });


 test("succesfull login", async () => {
   userModel.findOne =  jest.fn().mockResolvedValue(mockUser);
   comparePassword.mockResolvedValue(true);
   JWT.sign.mockReturnValue("mocked-jwt-token");
   await loginController(req, res);


   expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
   expect(comparePassword).toHaveBeenCalledWith("password123", mockUser.password);
   expect(JWT.sign).toHaveBeenCalledWith({ _id: mockUser._id }, process.env.JWT_SECRET, {
     expiresIn: "7d",
   });


   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: true,
       message: "login successfully",
       user: expect.objectContaining({
         _id: mockUser._id,
         name: mockUser.name,
         email: mockUser.email,
         role: mockUser.role,
       }),
       token: "mocked-jwt-token",
     })
   );
 });


 test("email is not registered", async () => {
   userModel.findOne =  jest.fn().mockResolvedValue(null);
   await loginController(req, res);


   expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Email is not registerd",
     })
   );
 });




 test("wrong password", async () => {
   userModel.findOne =  jest.fn().mockResolvedValue(mockUser);
   comparePassword.mockResolvedValue(false);
   await loginController(req, res);


   expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
   expect(comparePassword).toHaveBeenCalledWith("password123", mockUser.password);


   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Invalid Password",
     })
   );
 });




 test("email is missing", async () => {
   req = { body: {email: "", password: "password123",},};
 
   await loginController(req, res);


   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Invalid email or password",
     })
   );
 });




 test("email is invalid", async () => {
   req = { body: {email: "dbcjwhbdncj", password: "password123",},};
 
   await loginController(req, res);


   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Invalid email or password",
     })
   );
 });


 test("password is missing", async () => {
   req = { body:{email: "johndoe@example.com", password: "",}, };
 
   await loginController(req, res);


   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.send).toHaveBeenCalledWith(
     expect.objectContaining({
       success: false,
       message: "Invalid email or password",
     })
   );
 });

});

describe("forgotPassword Controller Test", () => {
  let req, res;
 
  const mockUser = {
   _id: "65b8d8f4c3a1b98765432101",
   name: "John Doe",
   email: "johndoe@example.com",
   password: "hashedpassword",
   phone: "123456789",
   address: { city: "NYC", country: "USA" },
   answer: "Football",
   role: 0,
 };
 
  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        email: "invalid-email",
        newPassword: "password123",
        answer: "Football",
      },
    };
 
 
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });
 
 
  test("invalid email", async () => {
    userModel.findOne = jest.fn().mockResolvedValue(null);
  
  
    await forgotPasswordController(req, res);
  
    expect(userModel.findOne).toHaveBeenCalledWith({ email: "invalid-email", answer:"Football" });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message:  "Wrong Email Or Answer",
      })
    );
  });


  test("wrong email and wrong answer", async () => {
    req = {
      body: {
        email: "test@email.com",
        newPassword: "password123",
        answer: "Basketball",
      },
    };
   
    userModel.findOne = jest.fn().mockResolvedValue(null);
  
  
    await forgotPasswordController(req, res);
  
    expect(userModel.findOne).toHaveBeenCalledWith({ email: "test@email.com", answer:"Basketball" });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message:  "Wrong Email Or Answer",
      })
    );
  });

  test("wrong email", async () => {
    req = {
      body: {
        email: "john@example.com",
        newPassword: "password123",
        answer: "Football",
      },
    };
   
    userModel.findOne = jest.fn().mockResolvedValue(null);
  
  
    await forgotPasswordController(req, res);
  
    expect(userModel.findOne).toHaveBeenCalledWith({ email: "john@example.com", answer:"Football" });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message:  "Wrong Email Or Answer",
      })
    );
  });


  test("wrong answer", async () => {
    req = {
      body: {
        email: "test@email.com",
        newPassword: "password123",
        answer: "Basketball",
      },
    };
   
    userModel.findOne = jest.fn().mockResolvedValue(null);
  
  
    await forgotPasswordController(req, res);
  
    expect(userModel.findOne).toHaveBeenCalledWith({ email: "test@email.com", answer:"Basketball" });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message:  "Wrong Email Or Answer",
      })
    );
  });
 
 
  test("empty email", async () => {
   req = {
    body: {
      email: "",
      newPassword: "password123",
      answer: "Football",
    },
  };

  await forgotPasswordController(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Email is required",
    })
  );
 });
 
 
 test("empty answer", async () => {
  req = {
    body: {
      email: "johndoe@example.com",
      newPassword: "password123",
      answer: "",
    },
  };

  await forgotPasswordController(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "answer is required",
    })
  );
});


test("empty password", async () => {
  req = {
    body: {
      email: "johndoe@example.com",
      newPassword: "",
      answer: "Football",
    },
  };

  await forgotPasswordController(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "New Password is required",
    })
  );
});

test("new password is the same as the old password", async () => {
  req = {
    body: {
      email: "johndoe@example.com",
      newPassword: "newpassword",
      answer: "Football",
    },
  };
  userModel.findOne = jest.fn().mockResolvedValue(mockUser);
  hashPassword.mockResolvedValue("hashedpassword");
  comparePassword.mockResolvedValue(true);
  await forgotPasswordController(req, res);

  expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com", answer: "Football" });
  expect(hashPassword).toHaveBeenCalledWith("newpassword");
  expect(comparePassword).toHaveBeenCalledWith("hashedpassword", mockUser.password);
  expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "New Password is required",
    })
  );
});
 
 test("reset success", async () => {
  req = {
    body: {
      email: "johndoe@example.com",
      newPassword: "newpassword",
      answer: "Football",
    },
  };
  userModel.findOne = jest.fn().mockResolvedValue(mockUser);
  hashPassword.mockResolvedValue("newhashedpassword");
  comparePassword.mockResolvedValue(false);
  userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

  await forgotPasswordController(req, res);
  
  expect(userModel.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com", answer: "Football" });
  expect(hashPassword).toHaveBeenCalledWith("newpassword");
  expect(comparePassword).toHaveBeenCalledWith("newhashedpassword", mockUser.password);
  expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, {password: "newhashedpassword"});
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(
    expect.objectContaining({
      success: true,
      message: "Password Reset Successfully",
    })
  );
 });
 });
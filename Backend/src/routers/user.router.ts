import { Router } from 'express';
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import { IUser, UserModel } from '../models/user.model';
const cloudinary = require("../configs/cloudinary.config");
const upload = require("../configs/multer.config");


const router = Router();


const generateTokenResponse = (user: any) => {
  const token = jwt.sign({
    id: user.id
  }, "Expires In", {
    expiresIn: "1h"
  })
  return {
    id: user.id,
    password: user.password,
    Fullname: user.Fullname,
    isAdmin: user.isAdmin,
    ReferenceFaceURL: user.ReferenceFaceURL,
    token: token,
  };
}

router.post("/login", asyncHandler(
  async (req, res) => {
    const { id } = req.body;
    if( id == 'unknown'){
      res.status(400).send("User does not exist");
      return;
    }
    const user = await UserModel.findOne({ id });
    res.send(generateTokenResponse(user));
  }
))

router.get("/get/", asyncHandler(
  async (req, res) => {
    const users = await UserModel.find();
    res.send(users);                     
  }
))

router.post("/register", upload.single('image'), asyncHandler(
  async (req, res) => {
    const { id, Fullname } = req.body;
    const user = await UserModel.findOne({ id });
    if (user) {
      res.status(400)
        .send('ID Number Already Exist!');
      return;
    }
    
    const result = await cloudinary.uploader.upload(req.file?.path, {
      public_id: id,
      folder: "WildVote_ReferenceFaceURLS"
    });
    const newUser: IUser = {
      id,
      Fullname,
      isAdmin: false,
      ReferenceFaceURL: result.secure_url
    }
    const dbUser = await UserModel.create(newUser);
    res.send(dbUser);
  }
))


export default router;
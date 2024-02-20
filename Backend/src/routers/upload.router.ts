const cloudinary = require("../configs/cloudinary.config");
const upload = require("../configs/multer.config");
import { Router } from 'express';
import  asyncHandler  from 'express-async-handler';
import { UserModel } from '../models/user.model';

const router = Router();

  router.patch("/ORdoc", upload.single('image') ,asyncHandler(
    async (req, res) => {
        const result = await cloudinary.uploader.upload(req.file?.path);
        const {id} = req.body;
        const user = await UserModel.findOne({id: id});
        await user!.updateOne({ $set: { "ORdoc": result.secure_url } });
        res.send();
    }
  ))

  router.patch("/CRdoc", upload.single('image') ,asyncHandler(
    async (req, res) => {
        const result = await cloudinary.uploader.upload(req.file?.path);
        const {id} = req.body;
        const user = await UserModel.findOne({id: id});
        await user!.updateOne({ $set: { "CRdoc": result.secure_url } });
        res.send();
    }
  ))

  router.patch("/StudyLoad", upload.single('image') ,asyncHandler(
    async (req, res) => {
        const result = await cloudinary.uploader.upload(req.file?.path);
        const {id} = req.body;
        const user = await UserModel.findOne({id: id});
        await user!.updateOne({ $set: { "StudyLoad": result.secure_url } });
        res.send();
    }
  ))

  router.patch("/IDdoc", upload.single('image') ,asyncHandler(
    async (req, res) => {
        const result = await cloudinary.uploader.upload(req.file?.path);
        const {id} = req.body;
        const user = await UserModel.findOne({id: id});
        await user!.updateOne({ $set: { "IDdoc": result.secure_url } });
        res.send();
    }
  ))

  router.patch("/Payment", upload.single('image') ,asyncHandler(
    async (req, res) => {
        const result = await cloudinary.uploader.upload(req.file?.path);
        const {id} = req.body;
        const user = await UserModel.findOne({id: id});
        await user!.updateOne({ $set: { "Payment": result.secure_url } });
        res.send();
    }
  ))

export default router;
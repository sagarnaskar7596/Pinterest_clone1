import { Pin } from "../models/pinModel.js";
import TryCatch from "../utis/TryCatch.js";
import getDataUrl from "../utis/urlGenerator.js";
import cloudinary from "cloudinary";


//pin creaation
export const createPin = TryCatch(async (req, res) => {
  const { title, pin } = req.body;

  const file = req.file;
  const fileUrl = getDataUrl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Pin.create({
    title,
    pin,
    image: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    owner: req.user._id,
  });

  res.json({
    message: "pin created",
  });
});

//show all pin
export const getAllPins = TryCatch(async (req, res) => {
  const pins = await Pin.find().sort({ createdAt: -1 });

  res.json(pins);
});

//show single pin
export const getSinglePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id).populate("owner", "-password");

  res.json(pin);
});

//comment controller

export const commentOnPin = TryCatch(async (req, res) => {
  console.log("User Data:", req.user); // Debugging

  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No pin with this ID",
    });

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: User not found",
    });
  }

  pin.comments.push({
    user: req.user._id,
    name: req.user.name,
    comment: req.body.comment,
  });

  await pin.save();

  res.json({
    message: "Comment added",
  });
});

//delete comment
export const deleteComment = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin)
    return res.status(400).json({
      message: "No pin with this id",
    });

  if (!req.query.commentId)
    return res.status(404).json({
      message: "Please give comment id",
    });

  const commentIndex = pin.comments.findIndex(
    (item) => item._id.toString() === req.query.commentId.toString()
  );

  if (commentIndex === -1) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }

  const comment = pin.comments[commentIndex];

  if (comment.user.toString() === req.user._id.toString()) {
    pin.comments.splice(commentIndex, 1);

    await pin.save();

    return res.json({
      message: " Comment deleted",
    });
  } else {
    res.status(403).json({
      message: "You are not owner of this comment",
    });
  }
});

//delete pin

export const deletePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin) {
    return res.status(404).json({ message: "No pin found with this ID" });
  }

  if (pin.owner.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not the owner of this pin" });
  }

  // Delete the image from Cloudinary
  if (pin.image?.id) {
    await cloudinary.v2.uploader.destroy(pin.image.id);
  }

  // Delete the pin from the database
  await pin.deleteOne();

  return res.json({ message: "Pin and associated image deleted successfully" });
});

export const updatePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin) {
    return res.status(404).json({ message: "No pin found with this ID" });
  }
  if (pin.owner.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not the owner of this pin" });
  }

  pin.title = req.body.title;
  pin.pin = req.body.pin

  await pin.save()

  res.json({
    message: "Pin updated",
  }
)
});

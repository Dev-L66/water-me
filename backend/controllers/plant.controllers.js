import { Plant } from "../models/plant.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

//create plant
export const createPlant = async (req, res) => {
  try {
    const {
      name,
      lastWateredAt,
      waterFrequency,
      reminderEnabled,
      reminderTime,
      nextWateringDate,
    } = req.body;
    let { image } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (!name || !image) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (image) {
      try {
        const uploadedResponse = await cloudinary.uploader.upload(image);
        image = uploadedResponse.secure_url;
      } catch (error) {
        console.error(`Error in cloudinary upload: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error." });
      }
    }
    const newPlant = await Plant.create({
      name,
      image,
      lastWateredAt,
      waterFrequency,
      reminderEnabled,
      reminderTime,
      nextWateringDate,
      user: userId,
    });
    await Plant.populate(newPlant, { path: "user", select: "-password" });
    return res
      .status(201)
      .json({ message: "Plant created successfully.", newPlant });
  } catch (error) {
    console.error(`Error in createPlant controller: ${error}`);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

//get all plants
export const getAllPlants = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "USer not found" });
    }
    const plants = await Plant.find({ user: userId });

    if (!plants || plants.length === 0) {
      return res.status(404).json({ error: "No plants found." });
    }
    return res
      .status(200)
      .json({
        message: "Plants found successfully.",
        plants,
        ...user._doc,
        password: undefined,
      });
  } catch (error) {
    console.error(`Error in getAllPlants controller:${error}`);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

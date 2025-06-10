import { sendReminderMail } from "../config/nodemailer/nodemailer.config.js";
import { Plant } from "../models/plant.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import cron from "node-cron";

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
    const user = await User.findById(userId).select("-password");
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
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const plants = await Plant.find({ user: userId }).select("-password");

    if (!plants || plants.length === 0) {
      return res.status(404).json({ error: "No plants found." });
    }

    return res.status(200).json({
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

//get plant
export const getPlant = async (req, res) => {
  try {
    const userId = req.userId;
    const { plantId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const plant = await Plant.findById(plantId);

    if (!plant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    if (plant.user.toString() !== userId) {
      return res.status(401).json({ error: "Unauthorized. Access denied." });
    }

    return res.status(200).json({
      message: "Plant found successfully.",
      plant,
      ...user._doc,
      password: undefined,
    });
  } catch (error) {
    console.error(`Error in getPlant controller: ${error}`);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

//edit plant
export const updatePlant = async (req, res) => {
  try {
    const { plantId } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    if (plant.user.toString() !== userId) {
      return res.status(401).json({ error: "Unauthorized. Access denied." });
    }
    const updatedPlant = await Plant.findByIdAndUpdate(plantId, req.body);

    if (!updatedPlant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    return res
      .status(201)
      .json({ message: "Plant updated successfully.", updatedPlant });
  } catch (error) {
    console.error(`Error in updatePlant controller: ${error}`);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

//delete plant
export const deletePlant = async (req, res) => {
  try {
    const userId = req.userId;
    const { plantId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const plant = await Plant.findById(plantId);
    
    if (!plant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    if (plant.user.toString() !== userId.toString()) {
      console.log(plant.user._id.toString(), userId);
      return res.status(401).json({ error: "Unauthorized. Access denied." });
    }
    const deletePlant = await Plant.findByIdAndDelete(plantId);
    if (!deletePlant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    return res
      .status(201)
      .json({ message: "Plant deleted successfully.", deletePlant });
  } catch (error) {
    console.log(`Error in deletePlant controller: ${error}`);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
//confirm watering
export const confirmWatering = async (req, res) => {
  try {
    const userId = req.userId;
    const { plantId } = req.params;

    const plant = await Plant.findOne({ _id: plantId, user: userId });
    if (!plant) {
      return res
        .status(404)
        .json({ error: "Plant not found or unauthorized, access denied." });
    }
    const newReminderTime = new Date();
    newReminderTime.setDate(newReminderTime.getDate() + plant.waterFrequency);
    const updatePlant = await Plant.findByIdAndUpdate(plantId, {
      lastWateredAt: new Date(),
      reminderTime: newReminderTime,
    });

    if (!updatePlant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    return res
      .status(201)
      .json({ message: "Watering confirmed successfully.", updatePlant });
  } catch (error) {
    console.log(`Error in confirmWatering controller: ${error}`);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

//schedule reminders
cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log(now);
  try {
    const plantsToRemind = await Plant.find({
      reminderEnabled: true,
      reminderTime: { $lte: now },
    })
      .populate("user")
      .select("-password");
    if (!plantsToRemind || plantsToRemind.length === 0) {
      return;
    }
    plantsToRemind.forEach(async (plant) => {
      try {
        await sendReminderMail(plant.user.email, plant.name);
        const newReminderTime = new Date();
        newReminderTime.setDate(
          newReminderTime.getDate() + plant.waterFrequency
        );
        console.log(newReminderTime);
        await Plant.findByIdAndUpdate(plant._id, {
          reminderTime: newReminderTime,
          // lastWateredAt: now,
        });
      } catch (error) {
        console.log(`Error in sending reminder:${error}`);
      }
    });
  } catch (error) {
    console.log(`Error in cron-job:${error}`);
  }
});

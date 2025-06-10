import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    lastWateredAt: {
      type: Date,
      default: null,
    },

    waterFrequency: {
      type: Number,
      default: 3,
    },

    reminderEnabled: {
      type: Boolean,
      default: true,
    },
    reminderTime: {
      type: Date,
      default: new Date(),
    },
    nextWateringDate: {
      type: Date,
      default: Date.now() + 3,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
     
    },
  },
  { timestamps: true, strict: true }
);

export const Plant = mongoose.model("plant", plantSchema);

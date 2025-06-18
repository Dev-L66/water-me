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
      default: new Date().toDateString(),
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
      default: function () {
        const lastWatered = this.lastWateredAt || new Date();
        return new Date(
          lastWatered.getTime() + this.waterFrequency * 24 * 60 * 60 * 1000
        );
      },
    },
    watered:{
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, strict: true }
);

export const Plant = mongoose.model("plant", plantSchema);

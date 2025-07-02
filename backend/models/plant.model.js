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
      default: () => new Date(),
    },

    waterFrequency: {
      type: Number,
      default: 3,
    },

    reminderEnabled: {
      type: Boolean,
      default: true,
    },

    nextWateringDate: {
      type: Date,
    },
    watered: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, strict: "throw" }
);

plantSchema.pre("save", function (next) {
  if (!this.nextWateringDate) {
    const lastWatered = this.lastWateredAt || new Date();
    const frequency = this.waterFrequency || 0;
    this.nextWateringDate = new Date(
      lastWatered.getTime() + frequency * 24 * 60 * 60 * 1000
    );
  }
  next();
});

export const Plant = mongoose.model("plant", plantSchema);

import mongoose, { Schema } from "mongoose";
import type { AchievementDocument, AchievementKey } from "../types/domain.js";

const achievementKeys: AchievementKey[] = [
  "first_activity",
  "seven_day_streak",
  "twenty_five_activities",
  "fifty_activities",
  "hundred_kg_saved",
  "five_hundred_kg_saved",
];

const achievementSchema = new Schema<AchievementDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    achievementKey: {
      type: String,
      enum: achievementKeys,
      required: true,
    },
    unlockedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

achievementSchema.index({ userId: 1, achievementKey: 1 }, { unique: true });

export const AchievementModel = mongoose.model<AchievementDocument>("Achievement", achievementSchema, "achievements");

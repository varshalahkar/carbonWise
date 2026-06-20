import mongoose, { Schema } from "mongoose";
import { ACTIVITY_CATEGORIES } from "../constants/emissionFactors.js";
import type { ActivityDocument } from "../types/domain.js";

const activitySchema = new Schema<ActivityDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ACTIVITY_CATEGORIES,
      required: true,
      index: true,
    },
    subtype: {
      type: String,
      required: true,
      trim: true,
    },
    inputData: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
    emissionFactor: {
      type: Number,
      required: true,
      min: 0,
    },
    co2Emission: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

activitySchema.index({ userId: 1, createdAt: -1 });

export const ActivityModel = mongoose.model<ActivityDocument>("Activity", activitySchema, "activities");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    jobId: {
      type: Number, // From PostgreSQL (Job table)
      required: true,
    },
    participants: [
      {
        type: Number, // From PostgreSQL (User table)
        required: true,
      },
    ],
    conversationKey: {
      type: String,
      required: true,
      unique: true,
    },
    lastMessage: {
      text: String,
      sender: Number, // From PostgreSQL (User table)
      createdAt: Date,
      _id: false, // prevents Mongo from creating an _id for this subdocument
    },
    active: { type: Boolean, default: true },
    lastReadMap: { type: Map, of: Date, default: {} },
  },
  { timestamps: true }
);

// Always sort participants to ensure consistent ordering and build conversationKey so no race condition
conversationSchema.pre("validate", function (next) {
  if (this.participants && Array.isArray(this.participants)) {
    this.participants.sort((a, b) => a - b);
    this.conversationKey = `job_${this.jobId}_${this.participants.join("_")}`;
  }
  next();
});

// Virtual field to populate messages linked to this conversation
conversationSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversationId",
});
conversationSchema.set("toObject", { virtuals: true });
conversationSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Conversation", conversationSchema);

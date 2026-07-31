const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is Required"]
    }
}, {
    timestamps: true,
})

blacklistTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 } // 24 hours
);

const tokenBlacklistModel = mongoose.model("blacklistToken", blacklistTokenSchema)

module.exports = tokenBlacklistModel
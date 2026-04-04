const router = require("express").Router();
const ScratchCard =
 require("../models/ScratchCard.model");

const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/// Admin adds weekly reward
router.post("/add-reward", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = req.body.image; // fallback if they just pass a string URL somehow, though unlikely with our form

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "rewards" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const rewardData = {
      ...req.body,
      image: imageUrl
    };

    const reward = await ScratchCard.create(rewardData);

    res.json({
      message: "Reward added",
      reward
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add reward" });
  }
});

module.exports = router;

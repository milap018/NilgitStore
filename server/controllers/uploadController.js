import cloudinary from "../config/cloudinary.js";

export async function uploadImage(req, res) {
  try {
    const files = req.files?.length ? req.files : req.file ? [req.file] : [];

    if (files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image file." });
    }

    const uploads = await Promise.all(
      files.map((file) => {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        return cloudinary.uploader.upload(base64Image, {
          folder: "nilgit-store-products"
        });
      })
    );

    res.status(201).json({
      imageUrl: uploads[0].secure_url,
      imageUrls: uploads.map((upload) => upload.secure_url),
      publicIds: uploads.map((upload) => upload.public_id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

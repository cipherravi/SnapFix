const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { supabase } = require("../config");
const { UserService } = require("../services");

async function uploadImage(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("SnapFix") // your bucket name
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: "Failed to upload to Supabase." });
    }
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("SnapFix")
      .getPublicUrl(filePath);

    return res.status(200).json({
      message: "File uploaded successfully.",
      url: publicUrlData.publicUrl,
    });
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while uploading image";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getImageUrl(req, res) {
  try {
    const { fileName } = req.params;
    if (fileName) {
      const { data } = await supabase.storage
        .from("SnapFix")
        .getPublicUrl(fileName);

      res.status(200).json(data);
    } else {
      res.status(400).json({
        status: false,
        data: "",
        message: "Please provide right filename",
      });
    }
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching image";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getSignedImageUrl(req, res) {
  try {
    const { fileName } = req.params;
    if (fileName) {
      const { data, error } = await supabase.storage
        .from("SnapFix-private")
        .createSignedUrl(fileName, 60); // expires in 60 sec

      if (error) {
        console.error("Signed URL error:", error);
        return null;
      }

      res.status(200).json(data);
    }
    res.status(400).json({
      status: false,
      data: "",
      message: "Please provide right filename",
    });
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching image";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

async function uploadProfilePic(req, res) {
  try {
    const userId = req.user.id;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No profile image uploaded." });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}-${userId}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("SnapFix") // your bucket name
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: "Failed to upload to Supabase." });
    }
    // Save fileName to db
    await UserService.updateProfileImage(userId, fileName);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("SnapFix")
      .getPublicUrl(filePath);

    return res.status(200).json({
      message: "Profile image uploaded successfully.",
      url: publicUrlData.publicUrl,
    });
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while uploading image";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function getProfileImageUrl(req, res) {
  try {
    const { fileName } = req.params;
    if (fileName) {
      const { data } = await supabase.storage
        .from("SnapFix/profiles")
        .getPublicUrl(fileName);

      res.status(200).json(data);
    } else {
      res.status(400).json({
        status: false,
        data: "",
        message: "Please provide right filename",
      });
    }
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while fetching image";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  uploadImage,
  getImageUrl,
  getSignedImageUrl,
  uploadProfilePic,
  getProfileImageUrl,
};

const { StatusCodes } = require("http-status-codes");
const { getLogger } = require("../config");
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const { supabase } = require("../config");
const { KycService } = require("../services");

async function handleKycSubmit(req, res) {
  try {
    const userId = req.user.id;
    const files = req.files;

    // Validate files
    if (!files.id_front || !files.id_back || !files.selfie) {
      return res.status(400).json({ error: "All three images are required." });
    }

    // ✅ Step 1: Create or get KYC record for user
    let kycApplication = await KycService.createKyc({ userId });

    // ✅ Step 2: Upload each image to Supabase
    const uploads = [];
    for (const [docType, fileArr] of Object.entries(files)) {
      const file = fileArr[0];
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${Date.now()}-${userId}-${docType}.${fileExt}`;
      const filePath = `kycDocuments/${fileName}`;

      const { error } = await supabase.storage
        .from("SnapFix-private")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      // ✅ Step 3: Save document row in DB
      const doc = await KycService.createKycDocument({
        kycId: kycApplication.id,
        doc_type: docType.toLowerCase(), // e.g., id_front
        doc_url: fileName, // or `filePath` or full public URL if needed
      });

      uploads.push(doc);
    }
    SuccessResponse.data = kycApplication;
    SuccessResponse.message = "KYC submitted successfully";
    return res.status(StatusCodes.OK).json(SuccessResponse);
    // return res.status(StatusCodes.OK).json({
    //   message: "KYC submitted successfully",
    //   kycApplication,
    //   documents: uploads,
    // });
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Failed to submit kyc application";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { handleKycSubmit };

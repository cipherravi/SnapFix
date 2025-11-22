const { StatusCodes } = require("http-status-codes");
const { getLogger, ai } = require("../config");
const { generateAIResponse } = ai;
const logger = getLogger(__filename);
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/AppError");
const {} = require("../services");

async function generateJobDescription(req, res) {
  try {
    const { title, category, budget } = req.body;

    const system =
      "You create detailed, clear job descriptions for freelance marketplaces.";
    const prompt = `
Job Title: ${title}
Category: ${category}
Budget: ${budget}

Write a full job posting with:
- Overview
- Responsibilities
- Requirements
- Budget & timeline suggestions
- Not more than 100 words
- Rupees as currency
    `;

    const output = await generateAIResponse(prompt, system);

    SuccessResponse.data = output;
    SuccessResponse.message = "Successfully generated description";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while generating description";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}
async function recommendJobPricing(req, res) {
  try {
    const { title, category, description } = req.body;
    const system =
      "You are an expert pricing analyst for freelance jobs and and minimum price you can set is 50 and verify with internet how much for that job title people pay in india especially tier 3 cities and take average price.  Always return INR pricing.";
    const prompt = `
Job Title: ${title}
Category: ${category}
Description: ${description}


Return ONLY pricing text in this structure:

JUST pricing range nothing else keep it in under 3 words like 200-500
    `;

    const output = await generateAIResponse(prompt, system);

    SuccessResponse.data = output;
    SuccessResponse.message = "Successfully recommended price range for job";
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    logger.error(error.stack || error.message);
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppError
        ? error.message
        : "Something went wrong while recommending price range";
    ErrorResponse.error = error;
    ErrorResponse.message = message;
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = { generateJobDescription, recommendJobPricing };

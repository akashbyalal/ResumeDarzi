const express = require("express")
const authMiddleware = require('../middlewares/auth.middlewares')
const interviewController = require("../controllers/interview.controller")
const upload = require('../middlewares/file.middlewares')

const interviewRouter = express.Router()



/**
 *  - route Post /api/interview
 *  - generate new interview report on the basis of user self description, resume pdf and job description
 */
interviewRouter.post("/", authMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController)


/**
 * - route Get /api/interview/report/:interviewId
 * - get Reports using InterviewId
 */
interviewRouter.get("/:interviewId", authMiddleware.authUser, interviewController.getIntervivewReportByIdController)

/**
 *  - GET /api/interview
 *  - get all interview reports of logged in user
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 *  - Get /api/interview/resume/pdf
 *  - Generate Resume PDF on the basis of user Self Description, resume Cnotent and Job description
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter
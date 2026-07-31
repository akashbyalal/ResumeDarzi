const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/** Controller to generate Interview Report based on user self Description, Resume and job Description */
async function generateInterviewReportController(req, res) {
  const resumeFile = req.file;

  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription: selfDescription,
    jobDescription: jobDescription,
  });

  const interviewReportData = {
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
    skillGap: interviewReportByAi.skillGaps ?? interviewReportByAi.skillGap,
  };

  // Ensure we persist the field that matches the Mongoose schema.
  if (interviewReportData.skillGaps) {
    delete interviewReportData.skillGaps;
  }

  const interviewReport = await interviewReportModel.create(interviewReportData);

  res.status(201).json({
    message: "Interview Report Generated successfully",
    interviewReport,
  });
}

async function getIntervivewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Report not found",
    });
  }
  return res.status(200).json({
    message: "Interview Report fetched Successfully",
    interviewReport,
  });
}

/**Contoller to get all interview reports of logged in User */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    )

  res.status(200).json({
    message: "Interview Reports Fetched successfully",
    interviewReports,
  })
}

/** Controller to generate Resume PDF based on user Self Description, Resume and Job Description */
async function generateResumePdfController(req, res){
  const {interviewReportId} = req.params;
  const interviewReport = await interviewReportModel.findOne({
  _id: interviewReportId,
  user: req.user.id,
});
  if(!interviewReport){
    return res.status(404).json({
      message: "Interview Report not Found"
    })
  }
  const {resume, jobDescription, selfDescription} = interviewReport
  try {
  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    throw new Error("Generated PDF is empty");
  }

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  return res.status(200).send(pdfBuffer);
} catch (error) {
  console.error("PDF download failed:", error);
  return res.status(500).json({
    message: "Could not generate the resume PDF",
  });
}

}

module.exports = {
  generateInterviewReportController,
  getIntervivewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
};

const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewJsonSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "A Score between 0 and 100 indicating how well the candidate's profile matches the Job requirements...",
    },
    technicalQuestions: {
      type: "array",
      description:
        "Technical questions that can be asked in the interview along with their intention and answer guidance.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The technical interview question.",
          },
          intention: {
            type: "string",
            description: "Why the interviewer is asking this question.",
          },
          answer: {
            type: "string",
            description:
              "How the candidate should answer the question, including important points to cover.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },

    behavioralQuestions: {
      type: "array",
      description:
        "Behavioral interview questions along with their intention and answer guidance.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The behavioral interview question.",
          },
          intention: {
            type: "string",
            description: "Why the interviewer is asking this question.",
          },
          answer: {
            type: "string",
            description:
              "How the candidate should answer the question, including important points to cover.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },

    skillGaps: {
      type: "array",
      description: "Skills the candidate is lacking along with severity.",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The missing skill.",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Severity of the skill gap.",
          },
        },
        required: ["skill", "severity"],
      },
    },

    preparationPlan: {
      type: "array",
      description: "Day-wise interview preparation plan.",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
            description: "Day number starting from 1.",
          },
          focus: {
            type: "string",
            description: "Primary topic to focus on that day.",
          },
          tasks: {
            type: "array",
            description: "Tasks to complete on that day.",
            items: {
              type: "string",
            },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
    title: {
      type: "string",
      description:
        "The title of the job for which the interview report is generated",
    },
  },

  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title",
  ],
};

const interviewReportSchema = z.fromJSONSchema(interviewJsonSchema);

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `

You are an experienced technical interviewer.

Analyze the candidate based on the information below.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Generate:

1. 10 technical interview questions.
2. 8 behavioral interview questions.
3. Skill gaps with severity.
4. A detailed 14-day preparation plan.

Return ONLY valid JSON.
Do not include markdown.
Do not add any extra fields.
`;
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: prompt,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: interviewJsonSchema,
      },
    });

    const response = interviewReportSchema.parse(
      JSON.parse(interaction.output_text),
    );

    return response;
  } catch (err) {
    console.error(err);
  }
}

const resumePdfJsonSchema = {
  type: "object",
  properties: {
    html: {
      type: "string",
      description: "Complete HTML document of the resume.",
    },
  },
  required: ["html"],
};

const resumePdfSchema = z.fromJSONSchema(resumePdfJsonSchema);

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
  const page = await browser.newPage();
  await page.setContent(htmlContent, {
  waitUntil: "domcontentloaded",
  timeout: 30000,
});
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });
  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `
Generate a professional resume using the following information.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Requirements:
- Return a JSON object with a single field named "html".
- The "html" field must contain a complete HTML5 document.
- Start with <!DOCTYPE html>.
- Include <html>, <head>, <style>, and <body>.
- Embed all CSS inside the <style> tag.
- Do not use JavaScript.
- Tailor the resume for the given job description.
- Highlight the candidate's most relevant skills, projects, and experience.
- Do not invent any information.
- Ensure both the content and layout are ATS-friendly.
- Use clean typography, good spacing, and a modern professional design.
- Use subtle colors and font styling to improve readability.
- Make GitHub, LinkedIn, Portfolio, Email, and Website clickable using <a> tags.
- Keep the resume concise, ideally one page and at most two pages.
- Return only the JSON object. Do not include markdown or explanations.
`;
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: prompt,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: resumePdfJsonSchema,
      },
    });

    const response = resumePdfSchema.parse(JSON.parse(interaction.output_text));

    const pdfBuffer = await generatePdfFromHtml(response.html);
    return pdfBuffer;
    } catch (err) {
    console.error("Resume PDF generation failed:", err);
    throw err;
  }
}

module.exports = { generateInterviewReport, generateResumePdf };

const { SeverityLevel } = require("mongodb");
const mongoose = require("mongoose");

/**
 * - Job Description Schema: String
 * - Resume text: String
 * - self description: String
 * 
 * - match Score: number
 *
 *-  Technical Question : [{questino: "", intention: "", answers: ""}]
 * - Behaviroul Questinos : [{questino: "", intention: "", answers: ""}]
 * - Skil Gaps : [{skill: "", severity:"", }]
 * - preparation plan : [{day: "", focud: "", Task: ""}]
 */

const technicalQuestionsSchema = new mongoose.Schema({
    question: {
        type: String, 
        required: [true, "Technical Question is Required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is Required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

const behavioralQuestionsSchema = new mongoose.Schema({
    question: {
        type: String, 
        required: [true, "Technical Question is Required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is Required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is Required"]

    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"],
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [ {
        type: String,
        required: [true, "Task is required"]
    }]
}, {
    _id: false
})

 const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "job Description is Required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },

    technicalQuestions: [ technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "Job title is Required"]
    }

 }, {
    timestamps: true
 })

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = interviewReportModel
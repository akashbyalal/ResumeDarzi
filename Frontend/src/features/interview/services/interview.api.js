import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})


/** Service to generate interview Report using the Job Desc, Self Desc, Resume */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile}) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}

/** Service to Get InterviewReport with help of InterviewId */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}`)

    return response.data
}


/** Service to Get all the Interview Reports of the Logged in */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")
    return response.data
}


/** Service to Generate resume PDF based on User  selfDescription, current Resume Content, job Description*/
export const generateResumePdf = async({interviewReportId}) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}
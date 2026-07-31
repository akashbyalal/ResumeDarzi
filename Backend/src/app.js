const express = require("express");
const cookies = require("cookie-parser")
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cookies());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    credentials: true
}))

/** Require all the Routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes")

app.get("/", (req, res) => {
    res.send("Server is Running")
})


/** all the Routes here... */

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter)

module.exports = app;

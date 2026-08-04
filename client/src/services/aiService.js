import Groq from "groq-sdk";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

const groq = new Groq({
    apiKey: env.GROQ_API_KEY,
});

const generateQuestionsWithAI = async (interview) => {
    try {
        const prompt = `
You are an expert technical interviewer.

Generate ${interview.totalQuestions} interview questions.

Interview Details:

Job Role: ${interview.jobRole}

Experience Level: ${interview.experienceLevel}

Interview Type: ${interview.interviewType}

Difficulty: ${interview.difficulty}

Tech Stack:
${interview.techStack.join(", ")}

Return ONLY a valid JSON array.

Format:

[
  {
    "question": "Question text here"
  }
]

Rules:
- Return ONLY JSON.
- Do NOT use markdown.
- Do NOT use code blocks.
- Do NOT add explanations.
- Every object must contain only the "question" field.
`;

        const completion = await groq.chat.completions.create({
            model: env.GROQ_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
        });

        const text = completion.choices[0].message.content;

        const cleanText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const questions = JSON.parse(cleanText);

        if (!Array.isArray(questions)) {
            throw new Error("Invalid AI response format");
        }

        return questions;

    } catch (error) {
        console.error("AI Generation Error:", error);

        throw new ApiError(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            "Failed to generate interview questions"
        );
    }
};

const evaluateInterview = async (interview) => {

    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's interview answers.

Interview Details:

Job Role: ${interview.jobRole}

Experience Level: ${interview.experienceLevel}

Interview Type: ${interview.interviewType}

Difficulty: ${interview.difficulty}

Tech Stack:
${interview.techStack.join(", ")}

Questions and Answers:

${interview.questions
            .map(
                (item, index) => `
Question ${index + 1}:
${item.question}

Answer:
${item.answer}
`
            )
            .join("\n")}

Return ONLY valid JSON.

Format:

{
  "overallScore": 85,
  "overallFeedback": "Overall interview feedback",

  "questions": [
    {
      "question": "Question text",
      "feedback": "Feedback for this answer",
      "score": 90
    }
  ]
}

Rules:

- Return ONLY JSON.
- Do not use markdown.
- Do not use code blocks.
- Do not add explanations.
- Score must be between 0 and 100.
`;

    try {

        const completion = await groq.chat.completions.create({
            model: env.GROQ_MODEL,

            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],

            temperature: 0.3,

            response_format: {
                type: "json_object",
            },
        });

        const text =
            completion.choices[0].message.content;

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "AI Evaluation Error:",
            error
        );

        throw new ApiError(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            "Failed to evaluate interview"
        );
    }
};

export { generateQuestionsWithAI, evaluateInterview };
import HTTP_STATUS from "../constants/httpStatus.js";
import Interview from "../models/interviewModel.js";
import ApiError from "../utils/ApiError.js";
import {
    generateQuestionsWithAI,
    evaluateInterview as evaluateInterviewWithAI,
} from "./aiService.js";

const createInterview = async (interviewData, userId) => {

    const interview = await Interview.create({

        title: interviewData.title,

        jobRole: interviewData.jobRole,

        company: interviewData.company,

        experienceLevel: interviewData.experienceLevel,

        interviewType: interviewData.interviewType,

        difficulty: interviewData.difficulty,

        techStack: interviewData.techStack,

        totalQuestions: interviewData.totalQuestions,

        createdBy: userId,
    });

    return interview;

}

const getAllInterviews = async (userId) => {

    const interviews = await Interview.find({
        createdBy: userId,
    }).sort({
        createdAt: -1,
    });

    return interviews;
};

const getInterviewById = async (interviewId, userId) => {

    const interview = await Interview.findOne({
        _id: interviewId,
        createdBy: userId
    })

    if (!interview) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Interview not found"
        )
    }

    return interview;
}

const updateInterview = async (interviewId, userId, updateData) => {

    const interview = await Interview.findOne({
        _id: interviewId,
        createdBy: userId,
    })

    if (!interview) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Interview not found"
        );
    }

    interview.title = updateData.title;
    interview.jobRole = updateData.jobRole;
    interview.company = updateData.company;
    interview.experienceLevel = updateData.experienceLevel;
    interview.interviewType = updateData.interviewType;
    interview.difficulty = updateData.difficulty;
    interview.techStack = updateData.techStack;
    interview.totalQuestions = updateData.totalQuestions;

    await interview.save();

    return interview;

}

const deleteInterview = async (interviewId, userId) => {

    const interview = await Interview.findOneAndDelete({
        _id: interviewId,
        createdBy: userId,
    });

    if (!interview) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Interview not found"
        );
    }

    return;
}

const generateQuestions = async (interviewId, userId) => {

    const interview = await Interview.findOne({
        _id: interviewId,
        createdBy: userId
    });

    if (!interview) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Interview not found"
        );
    }

    const questions = await generateQuestionsWithAI(interview);

    interview.questions = questions;
    interview.status = "generated"

    await interview.save()

    return interview
}

const startInterview = async (interviewId, userId) => {

    const interview = await Interview.findOne({
        _id: interviewId,
        createdBy: userId
    })

    if (!interview) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Interview not found"
        )
    };

    if (interview.questions.length === 0) {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Generate interview questions first"
        )
    };

    if (interview.status === "in_progress") {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Interview is already in progress"
        );
    }

    if (interview.status === "completed") {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Interview is already completed"
        );
    }

    interview.status = "in_progress";
    interview.startedAt = new Date();

    await interview.save();

    return interview;
}

const submitInterview = async (interviewId, userId, answers) => {

    const interview = await Interview.findOne({
        _id: interviewId,
        createdBy: userId,
    });

    if (!interview) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Interview not found"
        );
    }

    if (interview.status !== "in_progress") {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Interview is not in progress"
        );
    }

    if (!answers || answers.length === 0) {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Answers are required"
        );
    }

    if (answers.length !== interview.questions.length) {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "All questions must be answered"
        )
    }

    interview.questions.forEach((question, index) => {
        question.answer = answers[index].answer;
    });

    interview.status = "completed"
    interview.completedAt = new Date();

    await interview.save();

    return interview;

}

const evaluateInterview = async (interviewId, userId) => {

    const interview = await Interview.findOne({
        _id: interviewId,
        createdBy: userId,
    });

    if (!interview) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Interview not found"
        );
    }

    if (interview.status !== "completed") {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Complete the interview first"
        );
    }

    const evaluation = await evaluateInterviewWithAI(interview);

    interview.questions.forEach((question, index) => {

        question.feedback =
            evaluation.questions[index].feedback;

        question.score =
            evaluation.questions[index].score;

    });

    interview.overallScore =
        evaluation.overallScore;

    interview.overallFeedback =
        evaluation.overallFeedback;

    await interview.save();

    return interview;
};


export default { createInterview, getAllInterviews, getInterviewById, updateInterview, deleteInterview, generateQuestions, startInterview, submitInterview, evaluateInterview };
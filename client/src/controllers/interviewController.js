import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import interviewService from "../services/interviewService.js";


const createInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.createInterview(req.body, req.user._id)

    return res.status(HTTP_STATUS.CREATED)
        .json(
            new ApiResponse(
                HTTP_STATUS.CREATED,
                "Interview created successfully",
                interview
            )
        )
})

const getAllInterviews = asyncHandler(async (req, res) => {

    const interviews = await interviewService.getAllInterviews(
        req.user._id
    )

    return res.status(HTTP_STATUS.OK)
        .json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Interviews fetched successfully",
                interviews
            )
        )
})

const getInterviewById = asyncHandler(async (req, res) => {

    const interview = await interviewService.getInterviewById(
        req.params.id,
        req.user._id
    )

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
            HTTP_STATUS.OK,
            "Interview fetched successfully",
            interview
        )
    );
})

const updateInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.updateInterview(
        req.params.id,
        req.user._id,
        req.body
    )

    return res.status(HTTP_STATUS.OK)
        .json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Interview updated successfully",
                interview
            )
        )

})

const deleteInterview = asyncHandler(async (req, res) => {
    await interviewService.deleteInterview(
        req.params.id,
        req.user._id
    );

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
            HTTP_STATUS.OK,
            "Interview deleted successfully"
        )
    );
});

const generateQuestions = asyncHandler(async (req, res) => {

    const interview = await interviewService.generateQuestions(
        req.params.id,
        req.user._id
    );

    return res.status(HTTP_STATUS.OK)
        .json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Interview questions generated successfully",
                interview
            )
        )
})

const startInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.startInterview(
        req.params.id,
        req.user._id
    )

    return res.status(HTTP_STATUS.OK)
        .json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Interview started successfully",
                interview
            )
        );
})

const submitInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.submitInterview(
        req.params.id,
        req.user._id,
        req.body.answers
    )

    return res.status(HTTP_STATUS.OK)
        .json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Interview submitted successfully",
                interview
            )
        );
})

const evaluateInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.evaluateInterview(
        req.params.id,
        req.user._id
    );

    return res.status(HTTP_STATUS.OK)
        .json(
            new ApiResponse(
                HTTP_STATUS.OK,
                "Interview evaluated successfully",
                interview
            )
        );
});

export { createInterview, getAllInterviews, getInterviewById, updateInterview, deleteInterview, generateQuestions, startInterview, submitInterview, evaluateInterview };
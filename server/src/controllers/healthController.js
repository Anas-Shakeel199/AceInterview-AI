
const healthCheck = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "AceInterview AI API is running...",
    });
};

export { healthCheck }; 
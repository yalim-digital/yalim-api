const authService = require('../services/auth.service');

const inscription = async (req, res) => {
    try {
        const result = await authService.inscription(
            req.body,
            req.file
        );

        return res.status(201).json(result);

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
};

module.exports = {
    inscription
};
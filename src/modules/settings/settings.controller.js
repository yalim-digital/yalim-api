const service = require('./settings.service');

/**
 * GET /settings
 */
const get = async (req, res) => {
    try {
        const data = await service.get();

        res.json({
            data
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



/**
 * PUT /settings
 */
const update = async (req, res) => {
    try {
        const result = await service.update(
            req.body
        );

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    get,
    update
};
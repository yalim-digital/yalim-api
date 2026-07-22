const service = require('./homeCta.service');

/**
 * GET /home-cta
 */
const get = async (req, res) => {
    try {
        const data = await service.get();

        res.json({ data });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * POST /home-cta
 */
const create = async (req, res) => {
    try {
        const result = await service.create(
            req.body,
            req.file
        );

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

/**
 * PUT /home-cta
 */
const update = async (req, res) => {
    try {
        const result = await service.update(
            req.body,
            req.file
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
    create,
    update
};
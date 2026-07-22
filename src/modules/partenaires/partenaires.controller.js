const service = require('./partenaires.service');

/**
 * GET /partenaires
 */
const getAll = async (req, res) => {
    try {
        const data = await service.getAll();
        res.json({ data });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * POST /partenaires
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
 * PUT /partenaires/:id
 */
const update = async (req, res) => {
    try {
        const result = await service.update(
            req.params.id,
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

/**
 * DELETE /partenaires/:id
 */
const remove = async (req, res) => {
    try {
        const result = await service.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    getAll,
    create,
    update,
    remove
};
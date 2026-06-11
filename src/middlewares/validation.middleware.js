const validate = (schema) => (req, res, next) => {

    const data = {
        ...req.body,
        photo_identite: req.file
            ? req.file.filename
            : null
    };

    const { error } = schema.validate(
        data,
        {
            abortEarly: true,
            stripUnknown: true
        }
    );

    if (error) {

        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });

    }

    next();
};

module.exports = validate;
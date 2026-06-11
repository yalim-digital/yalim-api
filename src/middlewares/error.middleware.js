const multer = require('multer');

const errorHandler =
(
    err,
    req,
    res,
    next
) => {

    console.error(err);

    if (
        err instanceof multer.MulterError
    ) {

        if (
            err.code === 'LIMIT_FILE_SIZE'
        ) {

            return res.status(400)
                .json({
                    success: false,
                    message:
                        'La photo ne doit pas dépasser 2 Mo.'
                });

        }

    }

    return res.status(
        err.status || 400
    ).json({
        success: false,
        message: err.message
    });

};

module.exports = errorHandler;
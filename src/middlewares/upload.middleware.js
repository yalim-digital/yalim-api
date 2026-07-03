const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    if (!file.mimetype.startsWith('image/')) {

        return cb(
            new Error('Seules les images sont autorisées'),
            false
        );
    }

    cb(null, true);
};

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 2 Mo
    }
});

// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({

//     destination: (req, file, cb) => {

//         cb(null, 'uploads/members');

//     },

//     filename: (req, file, cb) => {

//         const uniqueName =
//             Date.now() +
//             '-' +
//             Math.round(Math.random() * 1E9) +
//             path.extname(file.originalname);

//         cb(null, uniqueName);

//     }
// });

// const fileFilter = (
//     req,
//     file,
//     cb
// ) => {

//     const allowedMimeTypes = [
//         'image/jpeg',
//         'image/jpg',
//         'image/png',
//         'image/webp'
//     ];

//     if (
//         allowedMimeTypes.includes(
//             file.mimetype
//         )
//     ) {

//         cb(null, true);

//     } else {

//         cb(
//             new Error(
//                 'Seuls les fichiers JPG, JPEG, PNG et WEBP sont autorisés.'
//             ),
//             false
//         );

//     }

// };

// const upload = multer({

//     storage,

//     fileFilter,

//     limits: {
//         fileSize:
//             2 * 1024 * 1024 // 2 Mo
//     }

// });

// module.exports = upload;
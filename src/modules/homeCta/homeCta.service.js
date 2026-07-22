const repository = require('./homeCta.repository');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');
const cloudinary = require('../../config/cloudinary');

/**
 * GET CTA
 */
const get = async () => {
    return await repository.find();
};

/**
 * UPLOAD IMAGE
 */
const uploadImage = async (file) => {
    if (!file) return null;

    const result = await uploadToCloudinary(
        file.buffer,
        'home_cta'
    );

    return {
        url: result.secure_url,
        public_id: result.public_id
    };
};

/**
 * CREATE CTA
 */
const create = async (data, file) => {
    const image = file
        ? await uploadImage(file)
        : null;

    return await repository.create({
        ...data,
        image: image?.url
    });
};

/**
 * UPDATE CTA
 */
const update = async (data, file) => {
    const existing = await repository.find();

    if (!existing) {
        throw new Error("CTA introuvable");
    }

    let image = existing.image;

    if (file) {
        // supprimer ancienne image si Cloudinary
        if (existing.image) {
            const parts = existing.image.split('/');
            const publicId = parts[parts.length - 1]?.split('.')[0];

            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        const upload = await uploadImage(file);
        image = upload?.url;
    }

    await repository.update({
        ...data,
        image
    });

    return {
        message: "CTA mis à jour"
    };
};

module.exports = {
    get,
    create,
    update
};
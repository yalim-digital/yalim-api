const repository = require('./partenaires.repository');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');
const cloudinary = require('../../config/cloudinary');

/**
 * LISTE PUBLIC
 */
const getAll = async () => {
    return await repository.findAll();
};

/**
 * UPLOAD LOGO
 */
const uploadLogo = async (file) => {
    if (!file) return null;

    const result = await uploadToCloudinary(
        file.buffer,
        'partenaires'
    );

    return {
        url: result.secure_url,
        public_id: result.public_id
    };
};

/**
 * CREATE
 */
const create = async (data, file) => {
    let logo = null;

    if (file) {
        const upload = await uploadLogo(file);
        logo = upload?.url;
    }

    return await repository.create({
        ...data,
        logo
    });
};

/**
 * UPDATE
 */
const update = async (id, data, file) => {
    const existing = await repository.findById(id);

    if (!existing) {
        throw new Error("Partenaire introuvable");
    }

    let logo = existing.logo;

    if (file) {
        // supprimer ancien logo si Cloudinary
        if (existing.logo) {
            const parts = existing.logo.split('/');
            const publicId = parts[parts.length - 1]?.split('.')[0];

            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        const upload = await uploadLogo(file);
        logo = upload?.url;
    }

    await repository.update(id, {
        ...data,
        logo
    });

    return {
        message: "Partenaire mis à jour"
    };
};

/**
 * DELETE
 */
const remove = async (id) => {
    const existing = await repository.findById(id);

    if (!existing) {
        throw new Error("Partenaire introuvable");
    }

    if (existing.logo) {
        const parts = existing.logo.split('/');
        const publicId = parts[parts.length - 1]?.split('.')[0];

        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    }

    await repository.remove(id);

    return {
        message: "Partenaire supprimé"
    };
};

module.exports = {
    getAll,
    create,
    update,
    remove
};
const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');

const inscription = async (data, file) => {

    const existingUser =
        await authRepository.findByEmail(
            data.email
        );

    if (existingUser) {
        throw new Error(
            'Email déjà utilisé'
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            data.mot_de_passe,
            10
        );

    const matricule =
        'IDEM' + Date.now();

    return await authRepository.create({
        ...data,
        matricule,
        mot_de_passe: hashedPassword,
        photo_identite: file
            ? file.filename
            : null
    });
};

module.exports = {
    inscription
};
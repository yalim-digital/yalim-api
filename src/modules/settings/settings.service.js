const repository = require('./settings.repository');


/**
 * GET SETTINGS
 */
const get = async () => {
    const settings = await repository.find();

    if (!settings) {
        return null;
    }

    return settings;
};




/**
 * UPDATE
 */
const update = async (data) => {
    const existing = await repository.find();

    if (!existing) {
            await repository.create({
                ...data 
            });
             return {
                message: "Settings mis à jour"
            };
    }else{
            await repository.update({
                ...data 
            });
             return {
                    message: "Settings mis à jour"
                };
    }

  
};

module.exports = {
    get,
    update
};

const { v4: useId } = require('uuid');

const generateMatricule = () => {

    const year =
        new Date().getFullYear();

    const random =new Date().getDate()+'-'+new Date().getHours()+'-'+new Date().getMinutes()+'-'+new Date().getSeconds();
    console.log(random);

    return `IDEM-${year}-${random}`; 
};

module.exports = generateMatricule;
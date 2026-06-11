


const generateMatricule = () => {

    const year =
        new Date().getFullYear();

    const random =new Date().getMonth()+'-'+new Date().getDay()+'-'+new Date().getHours()+'-'+new Date().getMinutes()+'-'+new Date().getSeconds();
    console.log(random);

    return `IDEM-${year}-${random}`; 
};

module.exports = generateMatricule;
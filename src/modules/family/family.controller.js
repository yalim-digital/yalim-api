const service =
require('./family.service');



const getAll = async(req,res,next)=>{


try{


const result =
await service.getAll();


res.json(result);


}
catch(error){

next(error);

}


};





const getById = async(req,res,next)=>{


try{


const result =
await service.getById(
req.params.id
);


res.json(result);


}
catch(error){

next(error);

}


};





const create = async(req,res,next)=>{


try{


const id =
await service.create(
req.body
);


res.status(201)
.json({

message:
"Membre créé avec succès",

id

});


}
catch(error){

next(error);

}


};









/*
====================================
AJOUT ENFANT
====================================
*/

const createChild = async(req,res,next)=>{


try{


const result =
await service.createChild(
req.body
);



res.status(201)
.json({

message:
"Enfant ajouté avec succès",

data:result

});


}
catch(error){

next(error);

}


};









/*
====================================
AJOUT CONJOINT
====================================
*/

const createSpouse = async(req,res,next)=>{


try{


const result =
await service.createSpouse(
req.body
);



res.status(201)
.json({

message:
"Conjoint ajouté avec succès",

data:result

});


}
catch(error){

next(error);

}


};









const update = async(req,res,next)=>{


try{


await service.update(

req.params.id,

req.body

);



res.json({

message:
"Membre modifié"

});


}
catch(error){

next(error);

}


};











const remove = async(req,res,next)=>{


try{


const branch =
String(req.params.branch) === "true";



await service.remove(

req.params.id,

branch

);



res.json({

message:
"Membre supprimé"

});


}
catch(error){

next(error);

}


};









const getGraph = async(
    req,
    res,
    next
)=>{


try{


const result =
await service.getGraph();



res.json(result);



}
catch(error){

next(error);

}


};






module.exports={


getAll,

getById,

create,

createChild,

createSpouse,

update,

remove,

getGraph


};
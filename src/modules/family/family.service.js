const repository = require('./family.repository');





const getAll = async()=>{


    return await repository.findAllPersons();


};







const getById = async(id)=>{


    const person =
        await repository.findById(id);



    if(!person){

        throw new Error(
            "Personne introuvable"
        );

    }


    return person;


};








const create = async(data)=>{


    return await repository.createPerson({
        ...data
    });


};








const update = async(id,data)=>{


    const person =
        await repository.findById(id);



    if(!person){

        throw new Error(
            "Personne introuvable"
        );

    }



    return await repository.updatePerson(
        id,
        data
    );


};






const getGraph = async () => {

    const [
        persons,
        marriages,
        parentChild,
        timelines
    ] = await Promise.all([
        repository.getGraphPersons(),
        repository.getGraphMarriages(),
        repository.getGraphChildren(),
        repository.getPersonTimelines()
    ]);


    const nodes = [];
    const edges = [];



    /*
    ==================================
    INDEXES
    ==================================
    */

    const timelineMap = new Map();

    const personNodeMap = new Map();

    const unionMap = new Map();



    /*
    ==================================
    TIMELINES
    ==================================
    */

    timelines.forEach(event => {


        if (!timelineMap.has(event.person_id)) {

            timelineMap.set(
                event.person_id,
                []
            );

        }


        timelineMap.get(event.person_id).push({

            id:event.id,

            year:event.year,

            title:event.title,

            description:event.description,

            date:event.event_date

        });


    });




    /*
    ==================================
    PERSON NODES
    ==================================
    */


    persons.forEach(person=>{


        const node = {

            id:String(person.id),

            type:"person",


            data:{


                firstname:person.firstname,


                lastname:person.lastname,


                name:
                `${person.firstname} ${person.lastname ?? ""}`.trim(),



                gender:person.gender,


                role:person.role,


                village:person.village,


                branch:person.branch,


                photo:person.photo,


                birthDate:person.birth_date,


                deathDate:person.death_date,


                adopted:Boolean(person.adopted),



                timeline:
                timelineMap.get(person.id) ?? [],



                parents:[],


                children:[],


                spouse:null,


                hidden:false,


                collapsed:false


            }

        };


        nodes.push(node);


        personNodeMap.set(
            String(person.id),
            node
        );


    });







    /*
    ==================================
    UNION NODES
    ==================================
    */


    marriages.forEach(marriage=>{


        const unionId =
        `union-${marriage.id}`;



        const unionNode={


            id:unionId,


            type:"union",



            data:{


                marriedAt:
                marriage.married_at,


                separated:
                Boolean(marriage.separated),


                divorced:
                Boolean(marriage.divorced),



                spouses:[

                    String(marriage.person1_id),

                    String(marriage.person2_id)

                ],



                children:[]


            }


        };



        nodes.push(unionNode);



        unionMap.set(
            String(marriage.id),
            unionNode
        );




        /*
        PERSON -> UNION
        */


        edges.push({

            id:
            `edge-${marriage.person1_id}-${unionId}`,

            source:
            String(marriage.person1_id),

            target:
            unionId,

            type:"smoothstep"

        });



        edges.push({

            id:
            `edge-${marriage.person2_id}-${unionId}`,

            source:
            String(marriage.person2_id),

            target:
            unionId,

            type:"smoothstep"

        });




        /*
        SPOUSE
        */


        const person1 =
        personNodeMap.get(
            String(marriage.person1_id)
        );


        const person2 =
        personNodeMap.get(
            String(marriage.person2_id)
        );



        /*
        Une personne peut avoir plusieurs unions.
        Donc on stocke un tableau.
        */


        if(person1){

            if(!person1.data.spouses){

                person1.data.spouses=[];

            }


            person1.data.spouses.push(
                String(marriage.person2_id)
            );


        }



        if(person2){


            if(!person2.data.spouses){

                person2.data.spouses=[];

            }


            person2.data.spouses.push(
                String(marriage.person1_id)
            );


        }


    });








    /*
    ==================================
    MARRIAGE -> CHILD
    ==================================
    */


    parentChild.forEach(rel=>{


        const unionNode =
        unionMap.get(
            String(rel.marriage_id)
        );



        if(!unionNode)
            return;



        const unionId =
        `union-${rel.marriage_id}`;



        /*
        UNION -> CHILD
        */


        edges.push({

            id:
            `edge-${unionId}-${rel.child_id}`,

            source:
            unionId,

            target:
            String(rel.child_id),

            type:"smoothstep"

        });





        /*
        Ajouter enfant dans union
        */


        if(
            !unionNode.data.children.includes(
                String(rel.child_id)
            )
        ){

            unionNode.data.children.push(
                String(rel.child_id)
            );

        }






        /*
        Récupération des deux parents
        depuis marriage
        */


        const marriage =
        marriages.find(
            m =>
            String(m.id) === String(rel.marriage_id)
        );



        if(!marriage)
            return;



        const parentIds=[

            String(marriage.person1_id),

            String(marriage.person2_id)

        ];





        const childNode =
        personNodeMap.get(
            String(rel.child_id)
        );




        /*
        CHILD -> PARENTS
        */


        if(childNode){


            parentIds.forEach(parentId=>{


                if(
                    !childNode.data.parents.includes(
                        String(parentId)
                    )
                ){

                    childNode.data.parents.push(
                        String(parentId)
                    );

                }


            });


        }






        /*
        PARENTS -> CHILDREN
        */


        parentIds.forEach(parentId=>{


            const parentNode =
            personNodeMap.get(
                String(parentId)
            );


            if(parentNode){


                if(
                    !parentNode.data.children.includes(
                        String(rel.child_id)
                    )
                ){

                    parentNode.data.children.push(
                        String(rel.child_id)
                    );

                }


            }



        });



    });






    return {

        nodes,

        edges

    };


};



/*
====================================
AJOUT ENFANT
====================================
*/

const createChild = async(data)=>{


    /*
    ================================
    1 - Création personne
    ================================
    */


    const childId =
    await repository.createPerson({

        firstname:data.firstname,

        lastname:data.lastname ?? null,

        gender:data.gender,

        role:data.role ?? null,

        village:data.village,

        branch:data.branch ?? null,

        birth_date:data.birth_date ?? null,

        adopted:data.adopted ?? false,

        photo:data.photo ?? null

    });





    /*
    ================================
    2 - Récupération mariage parent
    ================================
    */


    const marriage =
    await repository.findMarriageByPerson(
        data.parentId
    );




    if(!marriage){


        throw new Error(
            "Le parent n'a pas de conjoint enregistré"
        );


    }






    /*
    ================================
    3 - Création relation
    ================================
    */


    await repository.createParentChild({

        marriage_id:marriage.id,

        child_id:childId

    });





    return {

        id:childId,

        message:
        "Enfant ajouté avec succès"

    };


};



/*
====================================
AJOUT CONJOINT
====================================
*/

const createSpouse = async(data)=>{


    /*
    ================================
    Création personne
    ================================
    */


    const spouseId =
    await repository.createPerson({

        firstname:data.firstname,

        lastname:data.lastname ?? null,

        gender:data.gender,

        role:data.role ?? null,

        village:data.village,

        branch:data.branch ?? null,

        photo:data.photo ?? null

    });






    /*
    ================================
    Création union
    ================================
    */


    const marriageId =
    await repository.createMarriage({

        person1_id:data.personId,

        person2_id:spouseId

    });





    return {


        id:spouseId,

        marriageId,


        message:
        "Conjoint ajouté avec succès"


    };


};


/*
====================================
DELETE
====================================
*/

const remove = async(id,branch=false)=>{


    const person =
    await repository.findById(id);



    if(!person){

        throw new Error(
            "Personne introuvable"
        );

    }




    if(branch){


        return await repository.deleteBranch(
            id
        );


    }else{
            return await repository.deletePerson(
                id
            );
    }



};




module.exports={


    getAll,

    getById,

    create,

    update,

    remove,

    getGraph,
    createChild,

    createSpouse,


};



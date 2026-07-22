const db = require('../../config/database');



/*
====================================
LISTE PERSONNES
====================================
*/

const findAllPersons = async()=>{


    const [rows] = await db.query(

    `
    SELECT *

    FROM persons

    ORDER BY firstname ASC

    `

    );


    return rows;

};





/*
====================================
DETAIL PERSONNE
====================================
*/

const findById = async(id)=>{


    const [rows] = await db.query(

    `
    SELECT *

    FROM persons

    WHERE id=?

    LIMIT 1

    `,
    [id]

    );


    return rows[0] ?? null;

};





/*
====================================
CREATE
====================================
*/

const createPerson = async(data)=>{


    const [result] = await db.query(

    `
    INSERT INTO persons

    (

        firstname,
        lastname,
        gender,
        role,
        village,
        branch,
        birth_date,
        death_date,
        adopted,
        photo

    )

    VALUES (?,?,?,?,?,?,?,?,?,?)

    `,

    [

        data.firstname,

        data.lastname,

        data.gender,

        data.role,

        data.village,

        data.branch,

        data.birth_date ?? null,

        data.death_date ?? null,

        data.adopted ?? false,

        data.photo ?? null

    ]);


    return result.insertId;


};





/*
====================================
UPDATE
====================================
*/

const updatePerson = async(id,data)=>{


    await db.query(

    `
    UPDATE persons

    SET

        firstname=?,

        lastname=?,

        gender=?,

        role=?,

        village=?,

        branch=?,

        birth_date=?,

        death_date=?,

        adopted=?,

        photo=?


    WHERE id=?

    `,

    [

        data.firstname,

        data.lastname,

        data.gender,

        data.role,

        data.village,

        data.branch,

        data.birth_date ?? null,

        data.death_date ?? null,

        data.adopted ?? false,

        data.photo ?? null,

        id

    ]);


    return true;


};





/*
====================================
DELETE
====================================
*/

const deletePerson = async(id)=>{


    await db.query(

    `
    DELETE FROM persons

    WHERE id=?

    `,

    [id]

    );


    return true;

};






/*
====================================
GRAPH PERSONS
====================================
*/

const getGraphPersons = async()=>{


    const [rows] = await db.query(

    `
    SELECT

        id,

        firstname,

        lastname,

        gender,

        role,

        village,

        branch,

        birth_date,

        death_date,

        adopted,

        photo


    FROM persons


    ORDER BY id ASC

    `

    );


    return rows;

};






/*
====================================
GRAPH MARRIAGES
====================================
*/

const getGraphMarriages = async()=>{


    const [rows] = await db.query(

    `
    SELECT


        m.id,


        m.person1_id,


        p1.firstname AS person1_firstname,

        p1.lastname AS person1_lastname,


        m.person2_id,


        p2.firstname AS person2_firstname,

        p2.lastname AS person2_lastname,


        m.married_at,

        m.separated,

        m.divorced



    FROM marriages m


    INNER JOIN persons p1

        ON p1.id = m.person1_id


    INNER JOIN persons p2

        ON p2.id = m.person2_id



    ORDER BY m.id ASC

    `

    );


    return rows;

};






/*
====================================
GRAPH PARENT CHILD
====================================
*/


const getGraphChildren = async()=>{


    const [rows] = await db.query(

    `
    SELECT

        id,

        marriage_id,

        child_id


    FROM parent_child


    ORDER BY id ASC

    `);


    return rows;

};




/*
====================================
TIMELINES
====================================
*/

const getPersonTimelines = async()=>{


    const [rows] = await db.query(

    `
    SELECT


        id,

        person_id,

        year,

        title,

        description,

        event_date,

        sort_order



    FROM family_timelines


    ORDER BY 

        year ASC,

        sort_order ASC


    `

    );


    return rows;

};

/*
====================================
CREATE MARRIAGE
====================================
*/

const createMarriage = async(data)=>{


    const [result] = await db.query(

    `
    INSERT INTO marriages

    (
        person1_id,
        person2_id,
        married_at,
        separated,
        divorced
    )

    VALUES (?,?,?,?,?)

    `,

    [

        data.person1_id,

        data.person2_id,

        data.married_at ?? null,

        data.separated ?? false,

        data.divorced ?? false

    ]);


    return result.insertId;


};

/*
====================================
CREATE PARENT CHILD
====================================
*/

const createParentChild = async(data)=>{


    const [result] = await db.query(

    `
    INSERT INTO parent_child

    (

        marriage_id,

        child_id

    )

    VALUES (?,?)

    `,

    [

        data.marriage_id,

        data.child_id

    ]);


    return result.insertId;


};

/*
====================================
FIND MARRIAGE BY PERSON
====================================
*/

const findMarriageByPerson = async(personId)=>{


    const [rows] = await db.query(

    `
    SELECT *

    FROM marriages

    WHERE person1_id=?

    OR person2_id=?

    LIMIT 1

    `,

    [

        personId,

        personId

    ]);


    return rows[0] ?? null;


};

/*
====================================
DELETE BRANCH
====================================
*/

const deleteBranch = async(personId)=>{


    const connection =
    await db.getConnection();


    try{


        await connection.beginTransaction();



        /*
        récupérer les enfants
        */


        const [children] =
        await connection.query(

        `

        SELECT 

            pc.child_id


        FROM parent_child pc


        INNER JOIN marriages m

        ON m.id = pc.marriage_id


        WHERE 

        m.person1_id=?

        OR

        m.person2_id=?

        `,

        [

            personId,

            personId

        ]);


        const childIds =
        children.map(
            c=>c.child_id
        );



        /*
        supprimer relations
        */


        await connection.query(

        `
        DELETE FROM parent_child

        WHERE child_id IN (?)

        `,

        [

            childIds.length
            ?
            childIds
            :
            [0]

        ]);



        /*
        supprimer mariage
        */


        await connection.query(

        `
        DELETE FROM marriages

        WHERE person1_id=?

        OR person2_id=?

        `,

        [

            personId,

            personId

        ]);




        /*
        supprimer personne
        */


        await connection.query(

        `
        DELETE FROM persons

        WHERE id=?

        `,

        [

            personId

        ]);



        await connection.commit();



        return true;


    }
    catch(error){


        await connection.rollback();

        throw error;


    }
    finally{

        connection.release();

    }


};





module.exports={


    findAllPersons,

    findById,


    createPerson,

    updatePerson,

    deletePerson,


    createMarriage,

    createParentChild,

    findMarriageByPerson,

    deleteBranch,


    getGraphPersons,

    getGraphMarriages,

    getGraphChildren,


    getPersonTimelines


};
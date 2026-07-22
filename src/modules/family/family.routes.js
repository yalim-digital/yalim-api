const express =
require('express');


const router =
express.Router();


const controller =
require('./family.controller');


const {
authenticate
}
=
require('../../middlewares/auth.middleware');





/*
====================================
LECTURE
====================================
*/


router.get(
'/',
controller.getAll
);



router.get(
'/graph',
controller.getGraph
);






/*
====================================
AJOUTS FAMILIAUX
====================================
*/


router.post(

'/child',

// authenticate,

controller.createChild

);





router.post(

'/spouse',

// authenticate,

controller.createSpouse

);






/*
====================================
DETAIL
====================================
*/


router.get(

'/:id',

controller.getById

);








/*
====================================
CREATE PERSON SIMPLE
====================================
*/


router.post(

'/',

// authenticate,

controller.create

);







/*
====================================
UPDATE
====================================
*/


router.put(

'/:id',

// authenticate,

controller.update

);








/*
====================================
DELETE
====================================
*/


router.delete(

'/:id/:branch',

// authenticate,

controller.remove

);






module.exports=router;
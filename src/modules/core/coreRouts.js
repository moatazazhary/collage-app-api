const express = require('express');
const { createDepartment, getAllDepartments, getDepartment, updateDepartment, deleteDepartment, getAllSemesters, getSemester } = require('./coreController')
const { departmentFormSchema } = require('./coreValidations');
const {validate} = require('../../middlewares/validate');
const {authenticateMiddleware,authorizationMiddleware} = require('../../middlewares/authMiddlewares')
const {roles} = require('../../utils/roles')
const router = express.Router();


// departments
router.post('/departments',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(departmentFormSchema),createDepartment);
router.get('/departments',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getAllDepartments);
router.get('/departments/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getDepartment)
router.put('/departments/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(departmentFormSchema),updateDepartment);
router.delete('/departments/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),deleteDepartment)


// semesters
router.get('/semesters',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getAllSemesters);
router.get('/semesters/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getSemester)


module.exports = router;
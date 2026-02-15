const express = require('express');
const { authenticateMiddleware, authorizationMiddleware } = require('../../middlewares/authMiddlewares');
const { roles } = require('../../utils/roles');
const {overView, FilesStatusSummary, DegreesStatusSummary, FileActivity} = require('./dashboard.controller')
// const {createDoctor,createBulkDoctors, getAllDoctors, getDoctor, updateDoctor, deleteDoctor} = require('../doctorController')
// const {createSchema, bulkCreateSchema} = require('../validations/doctorValidations');
// const {validate} = require('../../../middlewares/validate');
// const {authenticateMiddleware,authorizationMiddleware} = require('../../../middlewares/authMiddlewares')
// const {roles} = require('../../../utils/roles')
const router = express.Router();


router.get('/dashboard/overview',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),overView)
router.get('/dashboard/files-status-summary',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),FilesStatusSummary)
router.get('/dashboard/degrees-status-summary',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),DegreesStatusSummary)
router.get('/dashboard/files-activity-summary',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),FileActivity)

module.exports = router;
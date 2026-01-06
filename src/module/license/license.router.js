const { checkLogin } = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/body.validator");
const uploader = require("../../middlewares/multipart-parser.middleware");
const { allowedRole } = require("../../middlewares/rbac.middleware");
const licenseCtrl = require("./license.controller");
const { licenseCreateDTO, licenseUpdateDTO } = require("./license.validator");

const licenseRouter = require("express").Router();
//admin
licenseRouter.post('/create-license', checkLogin, allowedRole('admin'), uploader().fields([
    { name: 'image', maxCount: 1 },
]), bodyValidator(licenseCreateDTO), licenseCtrl.create)

licenseRouter.route('/:id')
    .patch(checkLogin, allowedRole('admin'), uploader().single('image'), bodyValidator(licenseUpdateDTO), licenseCtrl.update)
    .delete(checkLogin, allowedRole('admin'), licenseCtrl.delete)

//users
licenseRouter.get('/:id/detail', licenseCtrl.fetchLicense)
licenseRouter.get('/list-all-licenses', licenseCtrl.listAllLicense)


module.exports = licenseRouter;
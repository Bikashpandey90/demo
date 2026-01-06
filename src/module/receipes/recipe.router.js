const { checkLogin } = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/body.validator");
const uploader = require("../../middlewares/multipart-parser.middleware");
const { allowedRole } = require("../../middlewares/rbac.middleware");
const recipeCtrl = require("./recipe.controller");
const { recipeCreateDTO, recipeUpdateDTO } = require("./recipe.validator");

const recipeRouter = require("express").Router();
//admin
recipeRouter.post('/create-recipe', checkLogin, allowedRole('admin'), uploader().fields([
    { name: 'images', maxCount: 5 },
    { name: 'directionImages', maxCount: 5 }
]), bodyValidator(recipeCreateDTO), recipeCtrl.create)

recipeRouter.route('/:id')
    .patch(checkLogin, allowedRole('admin'), uploader().fields(
        [
            { name: 'images', maxCount: 5 },
            { name: 'directionImages', maxCount: 5 }
        ]
    ), bodyValidator(recipeUpdateDTO), recipeCtrl.update)
    .delete(checkLogin, allowedRole('admin'), recipeCtrl.delete)


//users
recipeRouter.get('/:slug/by-slug', recipeCtrl.fetchRecipe)
recipeRouter.get('/list-all-recipes', recipeCtrl.listAllRecipe)


module.exports = recipeRouter;
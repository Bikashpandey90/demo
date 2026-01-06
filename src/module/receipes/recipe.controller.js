const recipeSvc = require("./recipe.service");

class RecipeController {

    create = async (req, res, next) => {
        try {
            console.log(req.body)
            const data = await recipeSvc.transformCreateRequest(req)

            const recipe = await recipeSvc.createRecipe(data)

            res.json({
                detail: recipe,
                message: "Recipe created successfully",
                status: "RECIPE_CREATED",
                options: null
            })


        } catch (exception) {

            next(exception)
        }
    }
    fetchRecipe = async (req, res, next) => {
        try {
            const slug = req.params.slug
            const recipeDetail = await recipeSvc.getSingleByFilter({
                slug: slug
            })

            //list related recipes


            res.json({
                detail: recipeDetail,
                message: "Recipe fetched successfully",
                status: "RECIPE_FETCHED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    listAllRecipe = async (req, res, next) => {
        try {
            let skip = 0
            let limit = 100
            let filter = {}
            const recipes = await recipeSvc.getAllByFilter({ skip, limit, filter })
            res.json({
                detail: recipes,
                message: "All Recipes Fetched",
                status: "RECIPES_FETCHED",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }
    update = async (req, res, next) => {
        try {
            const data = await recipeSvc.getSingleByFilter({
                _id: req.params.id
            })
            console.log("Existing Data:")
            console.log(req.body)
            console.log(req.files)
            const transformData = await recipeSvc.transformUpdateRequest(req, data)
            const response = await recipeSvc.updateByFilter({
                _id: req.params.id
            }, transformData)
            res.json({
                detail: response,
                message: "Recipe Updated Successfully",
                status: "RECIPE_UPDATE_SUCCESS",
                options: null
            })
        } catch (exception) {
            next(exception

            )
        }
    }
    delete = async (req, res, next) => {
        try {
            const data = await recipeSvc.getSingleByFilter({
                _id: req.params.id
            })
            if (!data) {
                throw {
                    code: 404,
                    messgae: "Recipe not found",
                    status: "RECIPE_NOT_FOUND"
                }
            }
            const response = await recipeSvc.deleteByFilter({
                _id: data._id
            })
            res.json({
                detail: response,
                message: "Recipe deleted successfully !",
                status: "RECIPE_DELETE_SUCCESS",
                options: null
            })

        } catch (exception) {
            next(exception)
        }

    }


}
const recipeCtrl = new RecipeController();
module.exports = recipeCtrl;

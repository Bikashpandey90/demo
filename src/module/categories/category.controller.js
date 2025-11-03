const productSvc = require("../products/product.service");
const categorySvc = require("./category.service");

class CategoryController {

    create = async (req, res, next) => {
        try {
            const data = await categorySvc.transformCreateRequest(req)
            const category = await categorySvc.createCategory(data)

            res.json({
                detail: category,
                message: "Category Created Successfully",
                status: "CATEGORY_CREATE_SUCCESS",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    list = async (req, res, next) => {
        try {

            const categories = await categorySvc.listAllCategory(
                {
                    skip: 0,
                    limit: 10,
                    filter: {
                        $and: [{ status: 'active' },

                        ]
                    }
                }
            )

            res.json({
                detail: categories,
                message: "All categories fetched",
                stauts: "CATEGORIES_FETCH_SUCCESS",
                options: null
            })


        } catch (exception) {
            next(exception)
        }
    }
    fetchByCategory = async (req, res, next) => {
        try {
            const slug = req.params.slug
            let skip = 0
            let limit = 20

            const category = await categorySvc.getCategoryBySlug({
                slug: slug
            })
            if (!category) {
                res.json({
                    message: "Category not found",
                    status: "NOT_FOUND",
                    options: null
                })
            }
            let filter = {
                category: category._id,
            }

            const products = await productSvc.getAllByFilter({ skip, limit, filter })

            res.json({
                detail: products,
                message: "Product fetched successfully",
                status: "PRODUCT_FETCHED",
                options: null

            })


        } catch (exception) {
            next(exception)
        }
    }
}
const categoryCtrl = new CategoryController();
module.exports = categoryCtrl;

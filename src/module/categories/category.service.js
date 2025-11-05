const { default: slugify } = require("slugify");
const CategoryModel = require("./category.model");
const fileUploaderService = require("../../services/fileUploader.service");

class CategoryService {
    transformCreateRequest = async (req) => {
        try {
            let data = req.body
            console.log(data)
            data.slug = slugify(data.title, {
                lower: true
            })
            if (req.file) {
                data.image = await fileUploaderService.uploadFile(req.file.path, '/category')
            }

            return data

        } catch (exception) {
            console.log("Transform create request category exception : ", exception)
            throw (exception)
        }

    }
    transformUpdateRequest = async (req, categoryData) => {
        try {
            let data = req.body

            if (req.file) {
                data.image = await fileUploaderService.uploadFile(req.file.path, '/category')
            }

            return data

        } catch (exception) {
            console.log("transformUpdateRequest execption : ", exception)
            throw exception
        }
    }

    createCategory = async (data) => {
        try {
            const categoryObj = new CategoryModel(data)
            return await categoryObj.save()


        } catch (exception) {
            console.log("category create service exception : ", exception)
            throw exception
        }
    }

    listAllCategory = async ({ skip = 0, limit = 10, filter = {} }) => {
        try {
            const data = await CategoryModel.find(filter)
                .sort({ _id: 1 })
                .skip(skip)
                .limit(limit)

            return data

        } catch (exception) {
            console.log("listAllCategory service exception", exception)
            throw exception
        }
    }
    getCategoryBySlug = async (filter) => {
        try {
            const data = await CategoryModel.findOne(filter)
            return data

        } catch (exception) {
            console.log("getCategoryBySlug exception", exception)
            throw exception
        }
    }
    updateByFilter = async (filter, updateData) => {
        try {
            const response = await CategoryModel.findOneAndUpdate(filter, {
                $set: updateData
            })
            return response
        } catch (exception) {
            console.log('updateByFilter exception', exception)
            throw exception
        }
    }
    deleteByFilter = async (filter) => {
        try {
            const response = await CategoryModel.findOneAndDelete(filter)
            return response

        } catch (exception) {
            console.log('deletebyfilterexception: ', exception)
        }
    }

}
const categorySvc = new CategoryService();
module.exports = categorySvc;
const slugify = require("slugify");
const fileUploaderService = require("../../services/fileUploader.service");
const ProductModel = require("./product.model");

class ProductService {
    transformCreateRequest = async (req) => {
        try {
            let data = req.body;
            let images = []
            if (data.images) {
                images = [...data.images]
            }
            if (data.directionImages) {
                try {
                    // Parse JSON string coming from form-data
                    data.directionImages = JSON.parse(data.directionImages);

                    // Attach URLs later when processing files
                    data.directionImages = data.directionImages.map(img => ({
                        ...img,
                        url: img.url || null
                    }));

                } catch (err) {
                    console.log("Invalid directionImages JSON");
                    data.directionImages = [];
                }
            }
            if (req.files) {
                for (let image of req.files) {
                    let filepath = await fileUploaderService.uploadFile(image.path, '/product')
                    images.push(filepath);
                }
            }

            data.images = images;
            data.slug = slugify(data.name, {
                lower: true,
            });

            //createdBY data

            return data



        } catch (exception) {
            console.log("Error in transforming create product request", exception);
            throw exception;
        }

    }
    transformUpdateRequest = async (req, productData) => {
        try {
            let data = req.body
            let images = [
                ...productData['images']
            ]
            if (req.files) {
                for (let image of req.files) {
                    let filepath = await fileUploaderService.uploadFile(image.path, '/product')
                    images.push(filepath)
                }
            }
            data.images = images
            data.price = data.price * 100
            return data

        } catch (exception) {
            console.log("transformUpdateRequest execption : ", exception)
            throw exception
        }
    }
    createProduct = async (data) => {
        try {
            const productObj = new ProductModel(data);
            return await productObj.save();

        } catch (exception) {
            console.log("Error in creating product", exception);
            throw exception;
        }
    }
    getSingleByFilter = async (filter) => {


        try {
            const data = await ProductModel.findOne(filter)

            //populate category


            if (!data) {
                throw {
                    code: 404,
                    message: "Product not found",
                    status: "PRODUCT_NOT_FOUND"

                }
            }
            return data

        } catch (exception) {
            console.log("Error in fetching single product by filter", exception);
            throw exception;
        }
    }
    getAllByFilter = async ({ skip = 0, limit = 20, filter = {} }) => {
        try {
            let data = await ProductModel.find(filter)
                .populate("category", ["_id", "title", "slug"])
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit)
            return data;

        } catch (exception) {
            console.log("getAllByFilter error", exception)
            throw exception
        }
    }

    updateByFilter = async (filter, updateData) => {
        try {
            const response = await ProductModel.findOneAndUpdate(filter, {
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
            const response = await ProductModel.findOneAndDelete(filter)
            return response

        } catch (exception) {
            console.log('deleteByFilter', exception)
            throw exception
        }
    }


}
const productSvc = new ProductService();
module.exports = productSvc;
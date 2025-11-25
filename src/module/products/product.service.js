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
            if (data.nutritionalInfo) {
                data.nutritionalInfo = JSON.parse(data.nutritionalInfo);
            }
            if (data.directionImages) {
                try {
                    if (data.directionImages) {
                        data.directionImages = JSON.parse(data.directionImages);
                    } else {
                        data.directionImages = [];
                    }
                } catch (err) {
                    console.log("Invalid directionImages JSON");
                    data.directionImages = [];
                }
            }

            if (req.files) {

                // IMAGES
                if (req.files.images) {
                    for (let file of req.files.images) {
                        let filepath = await fileUploaderService.uploadFile(file.path, '/product');
                        images.push(filepath);
                    }
                }

                // DIRECTION IMAGES FILES
                if (req.files.directionImages) {

                    // ensure directionImages is always an array
                    if (!Array.isArray(data.directionImages)) {
                        data.directionImages = [];
                    }

                    for (let file of req.files.directionImages) {
                        let filepath = await fileUploaderService.uploadFile(file.path, '/product');

                        data.directionImages.push({
                            url: filepath
                        });
                    }
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

            if (data.nutritionalInfo) {
                try {
                    data.nutritionalInfo = JSON.parse(data.nutritionalInfo);
                } catch (e) {
                    console.log("Invalid nutritionalInfo JSON");
                }

            }
            if (data.directionImages) {
                try {
                    data.directionImages = JSON.parse(data.directionImages);
                } catch (err) {
                    console.log("Invalid directionImages JSON");
                    data.directionImages = productData.directionImages || [];
                }

            }
            let images = [
                ...productData['images']
            ]
            let directionImages = [...(productData.directionImages || [])]

            if (req.files?.images) {
                const imageFiles = Array.isArray(req.files.images)
                    ? req.files.images
                    : [req.files.images];

                for (let file of imageFiles) {
                    let filepath = await fileUploaderService.uploadFile(
                        file.path,
                        "/product"
                    );
                    images.push(filepath);
                }
            }

            if (req.files?.directionImages) {
                const directionFiles = Array.isArray(req.files.directionImages)
                    ? req.files.directionImages
                    : [req.files.directionImages];

                for (let file of directionFiles) {
                    let filepath = await fileUploaderService.uploadFile(
                        file.path,
                        "/product"
                    );
                    directionImages.push({ url: filepath });
                }
            }

            data.images = images
            data.directionImages = directionImages
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
                .populate('category', ["title", "slug"])



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
                .populate("category", ["title", "slug"])
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
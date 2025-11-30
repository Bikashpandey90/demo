const slugify = require("slugify");
const fileUploaderService = require("../../services/fileUploader.service");
const ProductModel = require("./product.model");

class ProductService {
    transformCreateRequest = async (req) => {
        try {
            let data = req.body;
            // let images = []
            // if (data.images) {
            //     images = [...data.images]
            // }
            let directionFiles = []
            if (data.nutritionalInfo) {
                data.nutritionalInfo = JSON.parse(data.nutritionalInfo);
            }
            if (data.directionImages) {
                try {
                    if (data.directionImages) {
                        try {
                            data.directionImages = JSON.parse(data.directionImages);
                        } catch {
                            data.directionImages = [];
                        }
                    } else {
                        data.directionImages = [];
                    }
                } catch (err) {
                    console.log("Invalid directionImages JSON");
                    data.directionImages = [];
                }
            }

            let productImages = data.images ? JSON.parse(data.images) : [];
            let images = [];

            // if (req.files) {

            //     // IMAGES
            //     if (req.files?.images) {
            //         for (let file of req.files.images) {
            //             let filepath = await fileUploaderService.uploadFile(file.path, '/product');
            //             images.push(filepath);
            //         }
            //     }

            //     // DIRECTION IMAGES FILES
            //     if (req.files.directionImages) {

            //         // ensure directionImages is always an array
            //         if (!Array.isArray(data.directionImages)) {
            //             data.directionImages = [];
            //         }

            //         for (let file of req.files.directionImages) {
            //             let filepath = await fileUploaderService.uploadFile(file.path, '/product');

            //             data.directionImages.push({
            //                 url: filepath
            //             });
            //         }
            //     }
            // }

            if (req.files?.images) {
                const uploadedFiles = Array.isArray(req.files.images)
                    ? req.files.images
                    : [req.files.images];

                for (let file of uploadedFiles) {
                    const url = await fileUploaderService.uploadFile(file.path, '/product');
                    const match = productImages.find(img => img.fieldName === file.fieldName)
                    const position = match ? match.position : images.length;
                    images.push({
                        url,
                        position
                    })
                }
            }

            (productImages || []).forEach(img => {
                if (img.url) {
                    images.push({
                        url: img.url,
                        position: img.position || 0
                    })
                }
            })

            images.sort((a, b) => a.position - b.position);

            data.images = images;

            if (req.files?.directionImages) {
                directionFiles = Array.isArray(req.files.directionImages)
                    ? req.files.directionImages
                    : [req.files.directionImages];

            }

            if (!Array.isArray(data.directionImages)) {
                data.directionImages = [];
            }
            for (let file of directionFiles) {
                const url = await fileUploaderService.uploadFile(file.path, '/product');
                (data.directionImages || []).push({
                    url,
                    order: data.directionImages.length
                })
            }




            // data.images = images;
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

            } else {
                data.directionImages = productData.directionImages || [];
            }
            // let images = [
            //     ...productData['images']
            // ]
            // let directionImages = [...(productData.directionImages || [])]

            let productImages = data.images ? JSON.parse(data.images) : [];
            let images = [...(productData['images'] || [])];

            if (req.files?.images) {
                const imageFiles = Array.isArray(req.files.images)
                    ? req.files.images
                    : [req.files.images];

                for (let file of imageFiles) {
                    const url = await fileUploaderService.uploadFile(
                        file.path,
                        "/product"
                    );
                    const match = productImages.find(img => img.fieldName === file.fieldName)
                    const position = match ? match.position : images.length;

                    images.push(
                        { url, position }
                    )

                    // images.push(filepath);
                }
            }
            (productImages || []).forEach(img => {
                if (img.url && !images.find(i => i.url === img.url)) {
                    images.push({
                        url: img.url,
                        position: img.position ?? images.length
                    })
                }
            })
            images.sort((a, b) => a.position - b.position);
            data.images = images

            let directionImages = [...(productData.directionImages || [])];



            if (req.files?.directionImages) {
                const directionFiles = Array.isArray(req.files.directionImages)
                    ? req.files.directionImages
                    : [req.files.directionImages];

                for (let file of directionFiles) {
                    const url = await fileUploaderService.uploadFile(
                        file.path,
                        "/product"
                    );

                    const match = data.directionImages.find(x => x.fieldName === file.fieldName)
                    const order = match ? match.order : directionImages.length;
                    const description = match ? match.description : '';

                    directionImages.push({
                        url,
                        order,
                        description: match ? match?.description : ''
                    })
                    // directionImages.push({ url: filepath });
                }
            }

            (data.directionImages || []).forEach(img => {
                if (img.url && !directionImages.find(i => i.url === img.url)) {
                    directionImages.push({
                        url: img.url,
                        order: img.order,
                        description: img.description || ''
                    })
                }
            })
            directionImages.sort((a, b) => a.order - b.order);
            data.directionImages = directionImages

            // data.images = images
            // data.directionImages = directionImages
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
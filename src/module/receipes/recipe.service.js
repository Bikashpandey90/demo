const slugify = require("slugify");
const fileUploaderService = require("../../services/fileUploader.service");
const RecipeModel = require("./recipe.model");

class RecipeService {
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

            try {
                data.directionImages = JSON.parse(data.directionImages);
            } catch {
                // If frontend DID NOT send JSON, keep as empty array
                data.directionImages = Array.isArray(data.directionImages) ? data.directionImages : [];
            }


            let recipeImages = data.images ? JSON.parse(data.images) : [];
            let images = [];


            if (req.files?.images) {
                const uploadedFiles = Array.isArray(req.files.images)
                    ? req.files.images
                    : [req.files.images];

                for (let file of uploadedFiles) {
                    const url = await fileUploaderService.uploadFile(file.path, '/recipe');
                    const match = recipeImages.find(img => img.fieldName === file.fieldName)
                    const position = match ? match.position : images.length;
                    images.push({
                        url,
                        position
                    })
                }
            }

            (recipeImages || []).forEach(img => {
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

            for (let i = 0; i < directionFiles.length; i++) {
                const file = directionFiles[i];
                const url = await fileUploaderService.uploadFile(file.path, "/recipe");

                data.directionImages.push({
                    url,
                    order: i
                });
            }

            data.slug = slugify(data.name, {
                lower: true,
            });


            return data



        } catch (exception) {
            console.log("Error in transforming create recipe request", exception);
            throw exception;
        }

    }
    transformUpdateRequest = async (req, recipeData) => {
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
                    data.directionImages = recipeData.directionImages || [];
                }

            } else {
                data.directionImages = recipeData.directionImages || [];
            }

            let recipeImages = data.images ? JSON.parse(data.images) : [];
            let images = [...(recipeData['images'] || [])];

            if (req.files?.images) {
                const imageFiles = Array.isArray(req.files.images)
                    ? req.files.images
                    : [req.files.images];

                for (let file of imageFiles) {
                    const url = await fileUploaderService.uploadFile(
                        file.path,
                        "/recipe"
                    );
                    const match = recipeImages.find(img => img.fieldName === file.fieldName)
                    const position = match ? match.position : images.length;

                    images.push(
                        { url, position }
                    )

                    // images.push(filepath);
                }
            }
            (recipeImages || []).forEach(img => {
                if (img.url && !images.find(i => i.url === img.url)) {
                    images.push({
                        url: img.url,
                        position: img.position ?? images.length
                    })
                }
            })
            images.sort((a, b) => a.position - b.position);
            data.images = images

            let directionImages = [...(recipeData.directionImages || [])];



            if (req.files?.directionImages) {
                const directionFiles = Array.isArray(req.files.directionImages)
                    ? req.files.directionImages
                    : [req.files.directionImages];

                for (let file of directionFiles) {
                    const url = await fileUploaderService.uploadFile(
                        file.path,
                        "/recipe"
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
    createRecipe = async (data) => {
        try {
            const recipeObj = new RecipeModel(data);
            return await recipeObj.save();

        } catch (exception) {
            console.log("Error in creating recipe", exception);
            throw exception;
        }
    }
    getSingleByFilter = async (filter) => {


        try {
            const data = await RecipeModel.findOne(filter)



            if (!data) {
                throw {
                    code: 404,
                    message: "Recipe not found",
                    status: "RECIPE_NOT_FOUND"

                }
            }
            return data

        } catch (exception) {
            console.log("Error in fetching single recipe by filter", exception);
            throw exception;
        }
    }
    getAllByFilter = async ({ skip = 0, limit = 20, filter = {} }) => {
        try {
            let data = await RecipeModel.find(filter)
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
            const response = await RecipeModel.findOneAndUpdate(filter, {
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
            const response = await RecipeModel.findOneAndDelete(filter)
            return response

        } catch (exception) {
            console.log('deleteByFilter', exception)
            throw exception
        }
    }


}
const recipeSvc = new RecipeService();
module.exports = recipeSvc;
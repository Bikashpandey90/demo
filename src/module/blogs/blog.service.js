const slugify = require("slugify");
const fileUploaderService = require("../../services/fileUploader.service");
const BlogModel = require("./blog.model");

class BlogService {
    transformCreateRequest = async (req) => {
        try {
            let data = req.body;
            data.slug = slugify(data.title, {
                lower: true,
            });

            if (req.files) {
                if (req.files.image && req.files.image[0]) {
                    data.image = await fileUploaderService.uploadFile(
                        req.files.image[0].path,
                        '/path'
                    );
                }

            }
            return data
        } catch (exception) {
            console.log("Error in transforming create blog request", exception);
            throw exception;
        }

    }
    transformUpdateRequest = async (req, blogData) => {
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
                    data.directionImages = blogData.directionImages || [];
                }

            } else {
                data.directionImages = blogData.directionImages || [];
            }

            let blogImages = data.images ? JSON.parse(data.images) : [];
            let images = [...(blogData['images'] || [])];

            if (req.files?.images) {
                const imageFiles = Array.isArray(req.files.images)
                    ? req.files.images
                    : [req.files.images];

                for (let file of imageFiles) {
                    const url = await fileUploaderService.uploadFile(
                        file.path,
                        "/blog"
                    );
                    const match = blogImages.find(img => img.fieldName === file.fieldName)
                    const position = match ? match.position : images.length;

                    images.push(
                        { url, position }
                    )

                    // images.push(filepath);
                }
            }
            (blogImages || []).forEach(img => {
                if (img.url && !images.find(i => i.url === img.url)) {
                    images.push({
                        url: img.url,
                        position: img.position ?? images.length
                    })
                }
            })
            images.sort((a, b) => a.position - b.position);
            data.images = images

            let directionImages = [...(blogData.directionImages || [])];



            if (req.files?.directionImages) {
                const directionFiles = Array.isArray(req.files.directionImages)
                    ? req.files.directionImages
                    : [req.files.directionImages];

                for (let file of directionFiles) {
                    const url = await fileUploaderService.uploadFile(
                        file.path,
                        "/blog"
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
    createBlog = async (data) => {
        try {
            const blogObj = new BlogModel(data);
            return await blogObj.save();

        } catch (exception) {
            console.log("Error in creating blog", exception);
            throw exception;
        }
    }
    getSingleByFilter = async (filter) => {


        try {
            const data = await BlogModel.findOne(filter)



            if (!data) {
                throw {
                    code: 404,
                    message: "Blog not found",
                    status: "BLOG_NOT_FOUND"

                }
            }
            return data

        } catch (exception) {
            console.log("Error in fetching single blog by filter", exception);
            throw exception;
        }
    }
    getAllByFilter = async ({ skip = 0, limit = 20, filter = {} }) => {
        try {
            let data = await BlogModel.find(filter)
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
            const response = await BlogModel.findOneAndUpdate(filter, {
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
            const response = await BlogModel.findOneAndDelete(filter)
            return response

        } catch (exception) {
            console.log('deleteByFilter', exception)
            throw exception
        }
    }


}
const blogSvc = new BlogService();
module.exports = blogSvc;
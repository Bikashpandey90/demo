const blogSvc = require("./blog.service");

class BlogController {

    create = async (req, res, next) => {
        try {
            console.log(req.body)
            console.log(req.body.content)
            const data = await blogSvc.transformCreateRequest(req)
            const blog = await blogSvc.createBlog(data)

            res.json({
                detail: blog,
                message: "Blog created successfully",
                status: "BLOG_CREATED",
                options: null
            })


        } catch (exception) {

            next(exception)
        }
    }
    fetchBlog = async (req, res, next) => {
        try {
            const slug = req.params.slug
            const blogDetail = await blogSvc.getSingleByFilter({
                slug: slug
            })

            //list related blogs


            res.json({
                detail: blogDetail,
                message: "Blog fetched successfully",
                status: "BLOG_FETCHED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    listAllBlog = async (req, res, next) => {
        try {
            let skip = 0
            let limit = 100
            let filter = {}
            const blogs = await blogSvc.getAllByFilter({ skip, limit, filter })
            res.json({
                detail: blogs,
                message: "All Blogs Fetched",
                status: "BLOGS_FETCHED",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }
    update = async (req, res, next) => {
        try {
            const data = await blogSvc.getSingleByFilter({
                _id: req.params.id
            })
            console.log("Existing Data:")
            console.log(req.body)
            console.log(req.files)
            const transformData = await blogSvc.transformUpdateRequest(req, data)
            const response = await blogSvc.updateByFilter({
                _id: req.params.id
            }, transformData)
            res.json({
                detail: response,
                message: "Blog Updated Successfully",
                status: "BLOG_UPDATE_SUCCESS",
                options: null
            })
        } catch (exception) {
            next(exception

            )
        }
    }
    delete = async (req, res, next) => {
        try {
            const data = await blogSvc.getSingleByFilter({
                _id: req.params.id
            })
            if (!data) {
                throw {
                    code: 404,
                    messgae: "Blog not found",
                    status: "BLOG_NOT_FOUND"
                }
            }
            const response = await blogSvc.deleteByFilter({
                _id: data._id
            })
            res.json({
                detail: response,
                message: "Blog deleted successfully !",
                status: "BLOG_DELETE_SUCCESS",
                options: null
            })

        } catch (exception) {
            next(exception)
        }

    }


}
const blogCtrl = new BlogController();
module.exports = blogCtrl;

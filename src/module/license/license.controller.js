const licenseSvc = require("./license.service");

class LicenseController {

    create = async (req, res, next) => {
        try {
            console.log(req.body)
            const data = await licenseSvc.transformCreateRequest(req)
            const license = await licenseSvc.createLicense(data)

            res.json({
                detail: license,
                message: "License created successfully",
                status: "LICENSE_CREATED",
                options: null
            })


        } catch (exception) {

            next(exception)
        }
    }
    fetchLicense = async (req, res, next) => {
        try {
            const id = req.params.id
            const licenseDetail = await licenseSvc.getSingleByFilter({
                _id: id
            })

            res.json({
                detail: licenseDetail,
                message: "License fetched successfully",
                status: "LICENSE_FETCHED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    listAllLicense = async (req, res, next) => {
        try {
            let skip = 0
            let limit = 100
            let filter = {}
            const licenses = await licenseSvc.getAllByFilter({ skip, limit, filter })
            res.json({
                detail: licenses,
                message: "All Licenses Fetched",
                status: "LICENSES_FETCHED",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }
    update = async (req, res, next) => {
        try {
            const data = await licenseSvc.getSingleByFilter({
                _id: req.params.id
            })
            console.log("Existing Data:")
            console.log(req.body)
            console.log(req.files)
            const transformData = await licenseSvc.transformUpdateRequest(req, data)
            const response = await licenseSvc.updateByFilter({
                _id: req.params.id
            }, transformData)
            res.json({
                detail: response,
                message: "License Updated Successfully",
                status: "LICENSE_UPDATE_SUCCESS",
                options: null
            })
        } catch (exception) {
            next(exception

            )
        }
    }
    delete = async (req, res, next) => {
        try {
            const data = await licenseSvc.getSingleByFilter({
                _id: req.params.id
            })
            if (!data) {
                throw {
                    code: 404,
                    messgae: "License not found",
                    status: "LICENSE_NOT_FOUND"
                }
            }
            const response = await licenseSvc.deleteByFilter({
                _id: data._id
            })
            res.json({
                detail: response,
                message: "License deleted successfully !",
                status: "LICENSE_DELETE_SUCCESS",
                options: null
            })

        } catch (exception) {
            next(exception)
        }

    }


}
const licenseCtrl = new LicenseController();
module.exports = licenseCtrl;

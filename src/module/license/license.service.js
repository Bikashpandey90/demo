const slugify = require("slugify");
const fileUploaderService = require("../../services/fileUploader.service");
const LicenseModel = require("./license.model");

class LicenseService {
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
            console.log("Error in transforming create license request", exception);
            throw exception;
        }

    }
    transformUpdateRequest = async (req, licenseData) => {
        try {
            let data = req.body

            if (req.file) {
                data.image = await fileUploaderService.uploadFile(req.file.path, '/license')
            } else {
                data.image = data.image
            }

            return data

        } catch (exception) {
            console.log("transformUpdateRequest execption : ", exception)
            throw exception
        }
    }
    createLicense = async (data) => {
        try {
            const licenseObj = new LicenseModel(data);
            return await licenseObj.save();

        } catch (exception) {
            console.log("Error in creating license", exception);
            throw exception;
        }
    }
    getSingleByFilter = async (filter) => {


        try {
            const data = await LicenseModel.findOne(filter)
            if (!data) {
                throw {
                    code: 404,
                    message: "License not found",
                    status: "LICENSE_NOT_FOUND"

                }
            }
            return data

        } catch (exception) {
            console.log("Error in fetching single license by filter", exception);
            throw exception;
        }
    }
    getAllByFilter = async ({ skip = 0, limit = 20, filter = {} }) => {
        try {
            let data = await LicenseModel.find(filter)
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
            const response = await LicenseModel.findOneAndUpdate(filter, {
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
            const response = await LicenseModel.findOneAndDelete(filter)
            return response

        } catch (exception) {
            console.log('deleteByFilter', exception)
            throw exception
        }
    }


}
const licenseSvc = new LicenseService();
module.exports = licenseSvc;
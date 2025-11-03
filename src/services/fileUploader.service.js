const CloudinaryService = require("./cloudinary.service");

class FileUploaderService extends CloudinaryService {

}
const fileUploaderService = new FileUploaderService();
module.exports = fileUploaderService;
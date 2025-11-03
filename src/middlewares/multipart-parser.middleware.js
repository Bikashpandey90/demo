const { allow } = require('joi');
const multer = require('multer');
const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = './public/'
        cb(null, path);
    },
    filename: (req, file, cb) => {
        let filename = file.originalname;
        cb(null, filename);
    }

});

const uploader = (type = 'image') => {
    let allowed = []
    if (type === 'image') {
        allowed = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'];
    }
    return multer({
        storage: myStorage,
        fileFilter: (req, file, cb) => {
            let ext = file.originalname.split('.').pop();
            if (allowed.includes(ext)) {
                cb(null, true);
            } else {
                cb({
                    code: 400,
                    message: "This file type is not allowed",
                    status: "FILE_TYPE_NOT_ALLOWED",
                    detail: { [file.fieldname]: " File format not supported" }
                })
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // 5 MB
        }
    })
}
module.exports = uploader;


class fileUploadError extends Error {
    statusCode;
    constructor (statusMessage , statusCode = 400){
        super(statusMessage);
        this.statusCode = statusCode;
    }
}

module.exports = {fileUploadError}
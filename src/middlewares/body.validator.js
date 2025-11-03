const bodyValidator = (schema) => {
    return async (req, res, next) => {
        try {
            const data = req.body
            await schema.validateAsync(data, {
                abortEarly: false
            })
            next();
        } catch (exception) {
            let messageBag = {}
            console.log(exception)
            exception.details.map((errDetail) => {
                messageBag[errDetail.context.label] = errDetail.message
            })
            next({
                code: 400,
                message: "Validation failed",
                status: "VALIDATION_ERROR",
            })
        }
    }
}

module.exports = {
    bodyValidator
};
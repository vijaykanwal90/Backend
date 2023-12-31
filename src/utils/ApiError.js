class ApiError extends Error{
    constrructor (
        statusCode,
        message= "Something went wrong",
        error = [],
        stack = ""
    ){
        // super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors
        if(stack){
            this.stack = stack
        }
        else {
            Error(this , this.constructor)
        }
    }
}
export {ApiError}
class ApiError extends Error{
    constrructor (
        statusCode,
        message= "Something went wrong",
        error = [],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors
        if(stack){
            this.stack = statck
        }
        else {
            Error(this , this.constructor)
        }
    }
}
export {ApiError}
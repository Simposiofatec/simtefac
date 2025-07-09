interface BaseResponse {

}

interface SuccessResponse extends BaseResponse {
    content?: any;
    message?: string;
}

interface FailureResponse extends BaseResponse {
    message?: string;
    internalCode?: number;
}

export { BaseResponse, SuccessResponse, FailureResponse }
export const apiResponse = async (statusCode, payload ) => {
    return {
        statusCode: statusCode,
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({
            statusCode: statusCode,
            payload: payload
        })
    }
}
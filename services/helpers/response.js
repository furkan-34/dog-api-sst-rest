export const apiResponse = async (statusCode, payload ) => {
    return {
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            statusCode: statusCode,
            payload: payload
        })
    }
}
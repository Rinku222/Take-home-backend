module.exports = {
    removeNullValFromObj: async (body) => {
        for (const field in body) {
            if(body[field]?.toString() == '0'){ continue; }
            if (body[field] == '' || body[field] == 'null' || body[field] == null || body[field] == undefined || body[field] == 'undefined') delete body[field];
        }
        return body
    },
}
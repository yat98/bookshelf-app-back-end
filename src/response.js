const failResponse = (message, h) => h.response({
    status: 'fail', message,
});

const successResponse = (message, h) => h.response({
    status: 'success', message,
});

const successResponseWithData = (data, h) => h.response({
    status: 'success', data,
});

const successResponseAll = (message, data, h) => h.response({
    status: 'success', message, data,
});

module.exports = {
    failResponse,
    successResponse,
    successResponseWithData,
    successResponseAll,
};

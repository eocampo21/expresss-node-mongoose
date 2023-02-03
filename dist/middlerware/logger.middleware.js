// const { NextFunction, Request } = require('express');
function loggerMiddleware(request, response, next) {
    console.log(`I comming from middleware ${request.method} ${request}`);
    next();
}
export default loggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map

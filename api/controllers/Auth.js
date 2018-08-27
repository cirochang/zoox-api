exports.authorize = function(req, res, next) {
    const password = process.env.API_KEY || "foobar";
    const key = req.headers['x-api-key'];
    if (!key)
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    if (key !== password)
        return res.status(401).send({
            success: false,
            message: 'Failed to authenticate token.'
        });
    next();
};
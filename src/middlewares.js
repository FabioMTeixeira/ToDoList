const { JWT_SECRET } = require('./config'); 
const jwt = require('jsonwebtoken');

exports.authentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        return res.status(401).json({ error: 'invalid credentials' });
    };

    const [_, token] = authHeader.split(' ');
    if(!token) {
        return res.status(401).json({ error: 'invalid credentials' });
    };

    jwt.verify(token, JWT_SECRET, (error, payload) => {
        if(error) {
            return res.status(401).json({ error });
        }

        req.userId = payload.sub;
        next();
    });
};

exports.canAccessList = (req, res, next) => {
    const { listId } = req.params;
    const { userId } = req;

    if (!authorizationService.canAccessList(userId, listId)) {
        return res.status(401);
    };

    next();
}
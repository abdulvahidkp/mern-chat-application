const routes = require('express').Router();
const { registerUser, authUser, allUsers } = require('../CONTROLLERS/user.controllers');
const { protect } = require('../MIDDLEWARES/auth.middleware');

routes.route('/').post(registerUser).get(protect, allUsers);
routes.route('/login').post(authUser);

module.exports = routes;
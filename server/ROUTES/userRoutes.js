const routes = require('express').Router()
const { registerUser, authUser } = require('../CONTROLLERS/userControllers')

routes.route('/').post(registerUser)
routes.route('/login').post(authUser)

module.exports = routes
import express from 'express'
import { loginUser, RegisterUser, logout } from '../controller/RegisterationController.js';

const RegisterationRoutes = express.Router();

RegisterationRoutes.route('/').post(RegisterUser).get(loginUser);
RegisterationRoutes.route('/logout').get(logout);
export default RegisterationRoutes
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import './core/db'

import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validations/register';
import { passport } from './core/passport';

const app = express();

app.use(express.json());
app.use(passport.initialize())

app.get('/users', UserCtrl.index); 
app.get('/users/me', passport.authenticate('jwt'), UserCtrl.getUserInfo); 
app.get('/users/:id', UserCtrl.show); 
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);
app.get('/users/verify', registerValidations, UserCtrl.verify); 
// app.patch('/users', UserCtrl.update); 
// app.delete('/users', UserCtrl.delete);

app.listen(8888, (): void => {
    console.log('SERVER RUNNING!');
});
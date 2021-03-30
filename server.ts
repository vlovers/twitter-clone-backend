import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import './core/db'

import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validations/register';
import { passport } from './core/passport';
import { TweetCtrl } from './controllers/TweetController';
import { createTweetValidations } from './validations/createTweet';

const app = express();

app.use(express.json());
app.use(passport.initialize())

app.get('/users', UserCtrl.index); 
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo); 
app.get('/users/:id', UserCtrl.show); 

app.get('/tweets',  TweetCtrl.index);
app.get('/tweets/:id',  TweetCtrl.show);
app.delete('/tweets/:id', passport.authenticate('jwt'),  TweetCtrl.delete);
app.post('/tweets', passport.authenticate('jwt'), createTweetValidations, TweetCtrl.create);

app.get('/users/verify', registerValidations, UserCtrl.verify); 
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);

app.listen(8888, (): void => {
    console.log('SERVER RUNNING!');
});
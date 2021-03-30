import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'
import { TweetModel, TweetModelDocumentInterface, TweetModelInterface } from '../models/TweetModel'
import { generateMD5 } from '../utils/generateHash';
import mailer from '../core/mailer';
import { isValidObjectId } from 'mongoose';
import { UserModelInterface } from '../models/UserModel';

class TweetController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const users = await TweetModel.find({}).exec();
            res.json({
                status: 'seccess',
                data: users
            });
        } catch (error)  {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    }

    async show(req: any, res: express.Response): Promise<void> {
        try {
            const tweetId = req.params.id;
            console.log(tweetId);

            if (!isValidObjectId(tweetId )) {
                res.status(400).send();
                return;
            }

            const tweet = await TweetModel.findById(tweetId).exec();

            if (!tweet) {
                res.status(404).json({
                    status: 'error',
                    data: "Твит не найден"
                }).send();
                return;
            }

            res.json({
                status: 'seccess',
                data: tweet
            });
        } catch (error)  {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        const user = req.user as UserModelInterface;

        try {
            if (user?._id) {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    res.status(400).json({status:'error', errors: errors.array() })
                    return;
                }

                const data: TweetModelInterface = { 
                    text: req.body.text,
                    user: user._id,
                    
                }

                const tweet = await TweetModel.create(data);
                res.status(201).json({
                    status: 'success',
                    data: user
                })
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    }

    async delete(req: express.Request, res: express.Response): Promise<void> {
        const user = req.user as UserModelInterface;

        try {
            if (user) {
                const tweetId = req.params.id;

                if (!isValidObjectId(tweetId )) {
                    res.status(400).send();
                    return;
                }

                const tweet = await TweetModel.findById( tweetId ).exec();
                
                if (tweet) {
                    if (String(tweet.user) === String(user._id)) {
                        tweet.remove();
                        res.send();
                    } else {
                        res.status(403).send();
                    }
                   
                } else {
                    res.status(404).send();
                }
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    }
}

export const TweetCtrl = new TweetController();
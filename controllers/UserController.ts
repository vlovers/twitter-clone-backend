import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'
import { UserModel, UserModelDocumentInterface, UserModelInterface } from '../models/UserModel'
import { generateMD5 } from '../utils/generateHash';
import mailer from '../core/mailer';
import { isValidObjectId } from '../utils/isValidObjectId';

class UserController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec();
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
            const userId = req.params.id;
            console.log(userId);

            if (!isValidObjectId(userId )) {
                res.status(400).send();
                return;
            }

            const user = await UserModel.findById(userId).exec();

            if (!user) {
                res.status(404).json({
                    status: 'error',
                    data: "Пользователь не найден"
                }).send();
                return;
            }

            res.json({
                status: 'seccess',
                data: user
            });
        } catch (error)  {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.status(400).json({status:'error', errors: errors.array() })
                return;
            }

            const data: UserModelInterface = { 
                email:req.body.email,
                username: req.body.username,
                fullname: req.body.fullname,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirm_hash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            }

            const user = await UserModel.create(data);
            res.status(201).json({
                status: 'success',
                data: user
            })

            mailer({
                    from: '<admin@twitter.clone.com>', // sender address
                    to: data.email, // list of receivers
                    subject: "Подтвирждение почты Twiteer Clone", // Subject line
                    html: `Перейдите <a href="http://localhost:${process.env.PORT || 8888}/users/verify?hash=${data.confirm_hash}">по ссылке</a> для подтверждения акаунта!`, // plain text body
                })
    
        } catch (error)  {
            res.status(500).json({
                status: 'error',
                data: error
            });
        }
    }

    async verify (req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash;
            
            if (!hash) {
                res.status(422).json({ errors: "Invalid hash" });
                return;
            }
            const user = await UserModel.findOne({ confirm_hash: hash }).exec();
            if (user) {
                user.confirmed = true;
                user.save()

                res.json({
                    status: "success",
                    message: "Аккаунт успешно подтвержден!",
                });
            } else {
                res.status(404).send();
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error,
            })
        }
        
    };

    async afterLogin (req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined
            res.json({
                status: "seccess",
                data: {
                    ...user,
                    token: jwt.sign({data: req.user}, process.env.SECRET_KEY || "123", {
                        expiresIn: '30d'
                    })
            },

           })
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error,
            })
        }
        
    };

    async getUserInfo (req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user ? (req.user as UserModelDocumentInterface).toJSON() : undefined
            res.json({
                status: "seccess",
                data: user,
           })
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error,
            })
        }
        
    };
}

export const UserCtrl = new UserController();
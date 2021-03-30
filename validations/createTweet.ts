import { body } from 'express-validator';

export const createTweetValidations = [
    body('text', 'Введите техт твита')
        .isString()
        .isLength({
            max: 280
        })
        .withMessage('Допустимое кол-во символов твита 280 символов.')
]
import { body } from 'express-validator';

export const registerValidations = [
    body('email', 'Введите E-mail')
        .isEmail()
        .withMessage('Неверный E-mail')
        .isLength({
            min: 10,
            max: 40
        })
        .withMessage('Неверный E-mail'),
    body('fullname', 'Введите имя')
        .isString()
        .withMessage('Неверный E-mail')
        .isLength({
            min: 2,
            max: 20
        })
        .withMessage('Допустимое кол-во символов в имени от 2 до 10.'),
    body('username', 'Введите логин')
        .isString()
        .withMessage('Неверный E-mail')
        .isLength({
            min: 2,
            max: 20
        })
        .withMessage('Допустимое кол-во символов в логине от 2 до 10.'),
    body('password', 'Введите пароль')
        .isString()
        .withMessage('Неверный E-mail')
        .isLength({
            min: 6,
            max: 20
        })
        .withMessage('Допустимое кол-во символов в пароле от 6 до 10.')
        .custom((value, { req }) => {
            if (value !== req.body.password2) {
                throw new Error('Пароли не совпадают');
                
            } else {
                return value;
            }
            
        })
]
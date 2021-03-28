import nodemailer from "nodemailer";
import { SentMessageInfo } from 'nodemailer/lib/sendmail-transport';
  
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
        user: "54975e52bb38ef",
        pass: "e434ec2a11431c",
    }
}); 

export default (message: Object) => {
    transporter.sendMail(message, (err: Error | null, info: SentMessageInfo) => {
        if(err) {
            return console.log(err)
        } else {
            return console.log(info);
            
        };
    });
}
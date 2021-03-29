import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt} from 'passport-jwt';
import { UserModel, UserModelDocumentInterface, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';


passport.use(
    new LocalStrategy(
        async (username, password, done): Promise<void> => {
        try {
            const user = await UserModel.findOne({ $or: [{ email: username }, { username }]}).exec();

            if (user && user.password === generateMD5(password + process.env.SECRET_KEY)){
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
            
        }
    })
);

passport.serializeUser((user: any, done) => {
    done(null, user?._id);
});

passport.use(
    new JWTstrategy(
        {
        secretOrKey: process.env.SECRET_KEY || '123',
        jwtFromRequest: ExtractJwt.fromHeader('token')
        },
        async (payload, done) => {
            try {
                return done(null, payload.user);
            } catch (error) {
                done(error);
            }
        }
    )
);
  
passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: Error, user: UserModelInterface) => {
        done(err, user);
    });
});
    
export { passport };
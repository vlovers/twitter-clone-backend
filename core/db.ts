import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/twitter', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'conection error:'));

export {db, mongoose};
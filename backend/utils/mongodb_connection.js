const mongoose = require('mongoose');
const connection = 'mongodb+srv://lyb7772001:Ccuk7ydt@5347grup6.llg2om1.mongodb.net/5347?retryWrites=true&w=majority&appName=5347grup6';

const connectDatabase = () => {
mongoose.connect(connection, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log('Mongoose 连接成功了！');
}).catch(err => {
    console.error('Mongoose 连接错误:', err);
});
}

module.exports = connectDatabase;
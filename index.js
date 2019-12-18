const express = require('express');
const session = require(`express-session`);
const mysql = require(`mysql2`);
require(`dotenv`).config();

const db = mysql.createConnection({
    host     : process.env.GUESTBOOK_DB_HOST,
    port     : process.env.GUESTBOOK_DB_PORT,
    user     : process.env.GUESTBOOK_DB_USER,
    password : process.env.GUESTBOOK_DB_USER_PASSWORD,
    database : process.env.GUESTBOOK_DB_NAME,
});

const app = express();

app.set(`view engine`, `ejs`);
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static(`public`));

app.get('/', (request, response) => {
    db.query(`SELECT * FROM messages;`, (error, messages) => {
        if (error) {
            console.error(`Не смог подключиться к базе`);
            console.error(error);
            response.status(500).end();

            return;
        }
        response.render(`index`, {messages, session: request.session})
    });
});

app.post(`/message/create`, (request,response) => {
    const body = request.body;

    const name = body.name;
    const content = body.content;

    if(name && content) {
        db.query(`INSERT INTO messages1 (name, content) VALUES (?, ?)` [name, content], error => {
            if (error) {
                console.error(`Не смог записать в базу данных`)
                response.status(500).end();

                return;
            }
            response.redirect(`/`)
    });
    }else{
        request.session.error = "Введите имя и сообщение"
    }
});

const port = 80;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
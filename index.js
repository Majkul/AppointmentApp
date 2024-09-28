const express = require('express');
const mysql = require("mysql")
const path = require("path")
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const hbs = require('hbs');

const PORT = 5000;

dotenv.config({ path: '.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const viewsPath = path.join(__dirname, './views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Ustawienia dla katalogu z partials, jeśli używasz partials
const partialsPath = path.join(__dirname, './views/partials');
hbs.registerPartials(partialsPath);

// Middleware
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/auth/register", (req, res) => {    
    const { name_reg, email_reg, password_reg, password_confirm } = req.body

    db.query('SELECT email FROM users WHERE email = ?', [email_reg], async (error, result) => {
        if(error){
            console.log(error)
        }

        if( result.length > 0 ) {
            return res.render('login', {
                message: 'This email is already in use'
            })
        } else if(password_reg !== password_confirm) {
            return res.render('login', {
                message: 'Password Didn\'t Match!'
            })
        }

        let hashedPassword = await bcrypt.hash(password_reg, 8)

        console.log(hashedPassword)
       
        db.query('INSERT INTO users SET?', {name: name_reg, email: email_reg, password: hashedPassword}, (err, result) => {
            if(error) {
                console.log(error)
            } else {
                return res.render('login', {
                    message: 'User registered!'
                })
            }
        })        
    })
})
app.post("/auth/logowanie", (req, res) => {
    const { email_login, password_login } = req.body;   

    db.query('SELECT * FROM users WHERE email = ?', [email_login], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('login', {
                message: 'An error occurred. Please try again later.'
            });
        }

        if (results.length === 0) {
            return res.render('login', {
                message: 'Email or password is incorrect!'
            });
        }
        const isMatch = await bcrypt.compare(password_login, results[0].password);
        if (!isMatch) {
            return res.render('login', {
                message: 'Email or password is incorrect!'
            });
        }
        const id = results[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        console.log("Generated Token: ", token);

        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };

        res.cookie('jwt', token, cookieOptions);

        res.render('index', {
            message: 'Login successful!'
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

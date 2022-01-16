import express from 'express'
import chalk from 'chalk'
import hbs from 'hbs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import bodyParser from 'body-parser'
import flash from 'express-flash'
import session from 'express-session'
import conn from './database.js'
import util from 'util'

const moduleURL = new URL(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(moduleURL.pathname)
const app = express()
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirPath))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(session({
  secret: '123456catr',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(flash())
app.get('/', (req,res,next) => {
  let sql = 'SELECT name, fname FROM trainers ORDER BY fname'
  conn.query(sql, function(err, result){
    if(err) throw err;
    req.flash('success', 'Data added successfully!')
    res.render('index', {
      title: 'Trainers information',
      result: result
    })
  })

})
app.get('/trainer/:id', (req,res,next) => {
  let trainerId = req.params.id
  let sql = 'SELECT * FROM trainers t JOIN schedule s ON t.id = s.trainer_id AND t.fname = ?'
  conn.query(sql, [trainerId], function (err, result) {
    if (err) throw err;
    else{
      res.render('trainer', {
        title: trainerId,
        result: result
      })
    }
  })
})
app.get('/trainersplanning/:id', (req,res,next) => {
  let trainerId = req.params.id
  //console.log(chalk.cyan.bold(util.inspect(trainerId)))
  let sql = 'SELECT * FROM trainers t WHERE t.username = ?'
  conn.query(sql, [trainerId], function (err, result) {
    if (err) throw err;
    else{
      console.log(chalk.blue.bold(util.inspect(result)))
      res.render('trainersplanning', {
        title: trainerId,
        result: result
      })
    }
  })
})
app.get('/hello', (req,res,next) => {
  let sql = 'SELECT * FROM schedule'
  conn.query(sql, function (err, result) {
    if (err) throw err;
    else{
      res.render('hello', {
        result: result,
        title: 'Hello !',
        message: 'Les données ont été rajoutée. Merci et à la prochaine!'
      })
    }
  })
})
app.post('/hello', (req,res,next) => {
  let name, fname, trainer_id, company, date, time, yoga, pilates, other_classes, total_classes, sqlClass;
  name = req.body.name;
  fname = req.body.fname;
  trainer_id = req.body.trainer_id;
  company = req.body.company;
  date = req.body.date;
  time = req.body.time,
  yoga = req.body.yoga;
  pilates = req.body.pilates;
  other_classes = req.body.other_classes;
  total_classes = req.body.total_classes;
  sqlClass = `INSERT INTO schedule (name, fname, trainer_id, company, date, time, yoga, pilates, other_classes, total_classes) VALUES ("${name}", "${fname}", "${trainer_id}", "${company}", "${date}", "${time}", "${yoga}","${pilates}", "${other_classes}", "${total_classes}")`;
  conn.query(sqlClass, function(err, result){
    if(err) throw err;
    console.log(chalk.cyan.bold('Data added successfully into schedule!'))
    req.flash('success', 'Data added successfully into schedule!')
    res.redirect('/hello')
  })
})
app.post('/', (req,res,next) => {
  let name, fname, username, email, mobile, sql;
  name = req.body.name;
  fname = req.body.fname;
  username = req.body.username;
  email = req.body.email;
  mobile = req.body.mobile;
  sql = `INSERT INTO trainers (name, fname, username, email, mobile) VALUES ("${name}", "${fname}", "${username}", "${email}", "${mobile}")`;
  conn.query(sql, function(err, result){
    if(err) throw err;
    console.log(chalk.cyan.bold('record inserted'))
    req.flash('success', 'Data added successfully!')
    res.redirect('/')
  })
})

/*
app.use(function(req,res,next){
  next(createError(404))
})

app.use(function(err,req,res,next){
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500)
  res.render('error')

})
*/
app.listen(3000, () => {
  console.log(chalk.yellow.bgWhiteBright.bold.inverse(publicDirPath))
})
//module.exports = app
export default app

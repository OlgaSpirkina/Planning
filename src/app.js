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
import moment from 'moment'
import 'moment/locale/fr.js'

const moduleURL = new URL(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(moduleURL.pathname)
const app = express()
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
// Transform an array into object grouped by some data
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
//
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
// Variables
/* Calendar */
const days = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
]
const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
]
const years = [
  2022,
  2023,
  2024,
  2025
]
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let firstDay = (new Date(currentYear, currentMonth)).getDay();
let daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate();
let options = { month: 'long'};
let formatedMonth = new Intl.DateTimeFormat('fr-FR', options).format(currentMonth)
formatedMonth = formatedMonth.charAt(0).toUpperCase() + formatedMonth.slice(1);
//
/*** Function to create an object grouped by Month for Calendar ***/
let startOfClasses = [];
const createCalendarGroupedByMonths = (result) => {
  let daysOfWeek = [];
  (()=>{
    for(let i=0; i<result.length; i++){
      startOfClasses.push(moment(result[i].time).local('fr').format('LT'));
      daysOfWeek.push(moment(result[i].date).local('fr').format('L'))
    }
    return startOfClasses
  })()
  for(let i=0; i<startOfClasses.length; i++){
    for(let j=0; j<result.length; j++){
      if(i === j){
        result[j].time = startOfClasses[i]
      }
    }
  }
  let objMonth = {};
  for(let i=1; i<=daysInMonth; i++){
    let theDate = new Date(currentYear, currentMonth, i);
    objMonth[theDate] = []
  }
  let groupedByMonth = groupBy(result, 'choose_months')
  groupedByMonth[Object.keys(groupedByMonth)] = groupBy(Object.values(groupedByMonth)[0], 'date')
  for(let i=0; i<Object.keys(objMonth).length; i++){
    for(let j=0; j<Object.keys(Object.values(groupedByMonth)[0]).length; j++){
      if(Object.keys(objMonth)[i] === Object.keys(Object.values(groupedByMonth)[0])[j]){
          objMonth[Object.keys(objMonth)[i]] = Object.values(Object.values(groupedByMonth)[0])[j]
      }
    }
  }
  groupedByMonth[Object.keys(groupedByMonth)] = objMonth
  console.log(chalk.blue.bold(util.inspect(groupedByMonth)))
  Object.values(Object.values(Object.values(groupedByMonth))[0]).forEach((item) => {
    item.forEach((elem)=>{
      let timeNum = elem.time.split(":");
      let timeNumInSeconds = (parseInt(timeNum[0], 10) * 60 * 60) + (parseInt(timeNum[1], 10) * 60)
      elem['timeNumInSeconds'] = timeNumInSeconds
    })
    item.sort(function(a, b){
      return a.timeNumInSeconds - b.timeNumInSeconds
    })
  })
  return groupedByMonth;
}
//
app.get('/', (req,res,next) => {
  let sql = 'SELECT name, fname, mobile FROM trainers ORDER BY fname'
  conn.query(sql, function(err, result){
    if(err) throw err;
    req.flash('success', 'Data added successfully!')
    res.render('index', {
      title: 'Ajouter un nouveau professeur',
      result: result
    })
  })

})
app.get('/trainer/:id', (req,res,next) => {
  let trainerId = req.params.id
  let sql = 'SELECT * FROM trainers t JOIN schedule s ON t.id = s.trainer_id AND t.username = ?'
  conn.query(sql, [trainerId], function (err, result) {
    if (err) throw err;
    else{
      let trainersPersonalPlanning = createCalendarGroupedByMonths(result)
      let email, mobile;
      let countClasses = []
      let objForAllClasses = {}
      let objForSalary = {}
      for(let i=0; i<Object.values(Object.values(trainersPersonalPlanning)[0]).length; i++){
        if(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0] !== undefined){
          email = Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].email
          mobile = Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].mobile
        // Calculating total and individual classes
          if((objForAllClasses['yoga'] === undefined) || (objForAllClasses['pilates'] === undefined) || (objForAllClasses['other_classes'] === undefined) || (objForAllClasses['video'] === undefined)){
            objForAllClasses['yoga'] = parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].yoga, 10);
            objForAllClasses['pilates'] = parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].pilates, 10);
            objForAllClasses['other_classes'] = parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].other_classes, 10);
            objForAllClasses['video'] = parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].video, 10);
            objForAllClasses['total'] = parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].total_classes, 10);
          }else{
            objForAllClasses['yoga'] = objForAllClasses.yoga + parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].yoga, 10)
            objForAllClasses['pilates'] = objForAllClasses.pilates + parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].pilates, 10)
            objForAllClasses['other_classes'] = objForAllClasses.other_classes + parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].other_classes, 10)
            objForAllClasses['video'] = objForAllClasses.video + parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].video, 10)
            objForAllClasses['total'] = objForAllClasses.total + parseInt(Object.values(Object.values(trainersPersonalPlanning)[0])[i][0].total_classes, 10);
          }
        }
      }
      const countSalary = () => {
        for(let i=0; i<Object.keys(objForAllClasses).length; i++){
          switch(Object.keys(objForAllClasses)[i]){
            case 'yoga':
              objForSalary['yoga'] = objForAllClasses.yoga * 50;
              break;
            case 'pilates':
              objForSalary['pilates'] = objForAllClasses.pilates * 40;
              break;
            case 'video':
              objForSalary['video'] = objForAllClasses.video * 30;
              break;
            case 'other_classes':
              objForSalary['other_classes'] = objForAllClasses.other_classes * 30;
              break;
          }
        }
        return objForSalary
      }
      let objCountSalary = countSalary()
      res.render('trainer', {
        title: trainerId,
        result: trainersPersonalPlanning,
        email: email,
        mobile: mobile,
        allClasses: objForAllClasses,
        allSalaries: objCountSalary
      })
    }
  })
})
app.get('/trainersplanning/:id', (req,res,next) => {
  let trainerId = req.params.id
  conn.query('SELECT * FROM trainers t WHERE t.username = ?; SELECT company FROM companies ORDER BY company', [trainerId, 1, 2], function(err, result){
    if (err) throw err;
    else{
      let company = result[1]
      res.render('trainersplanning', {
        title: trainerId,
        result: result[0],
        company: company,
        months: months,
        years: years,
        currentMonth: formatedMonth,
        currentYear: currentYear
      })
    }
  })
})
app.get('/planning', (req,res,next) => {
  let sql = 'SELECT * FROM schedule'
  conn.query(sql, function (err, result) {
    if (err) throw err;
    else{
      let allTrainersPlanning = createCalendarGroupedByMonths(result)
      res.render('planning', {
        result: result,
        cal: allTrainersPlanning,
        title: 'planning !',
        message: 'Les données ont été rajoutée. Merci et à la prochaine!',
        timeOfClass: startOfClasses,
        currentYear: currentYear,
        days: days
      })
    }
  })
})
app.get('/entreprises', (req,res,next) => {
  let sql = 'SELECT * FROM companies ORDER BY company'
  conn.query(sql, function (err, result) {
    if (err) throw err;
    else{
      res.render('entreprises', {
        result: result
      })
    }
  })
})
app.get('/company-details/:id', (req,res,next) => {
  let companyId = req.params.id
  let sql = 'SELECT * FROM companies c JOIN schedule s ON c.company = s.company JOIN trainers t ON t.id = s.trainer_id AND c.contact_info = ?';
  conn.query(sql, [companyId], function (err, result) {
    if (err) throw err;
    else{
      let groupedByUsername = groupBy(result, 'username')
      console.log(chalk.cyan.bold(util.inspect(result)))
      res.render('company-details', {
        result: groupedByUsername
      })
    }
  })
})
app.post('/planning', (req,res,next) => {
  let name, fname, trainer_id, choose_months, choose_years, company, date, time, yoga, pilates, video, other_classes, total_classes, sqlClass;
  name = req.body.name;
  fname = req.body.fname;
  trainer_id = req.body.trainer_id;
  choose_months = req.body.choose_months;
  choose_years = req.body.choose_years;
  company = req.body.company;
  date = req.body.date;
  time = req.body.time,
  yoga = req.body.yoga;
  pilates = req.body.pilates;
  video = req.body.video;
  other_classes = req.body.other_classes;
  total_classes = req.body.total_classes;
  sqlClass = `INSERT INTO schedule (name, fname, trainer_id, choose_months, choose_years, company, date, time, yoga, pilates, video, other_classes, total_classes) VALUES ("${name}", "${fname}", "${trainer_id}", "${choose_months}", "${choose_years}", "${company}", "${date}", "${time}", "${yoga}","${pilates}", "${video}", "${other_classes}", "${total_classes}")`;
  conn.query(sqlClass, function(err, result){
    if(err) throw err;
    console.log(chalk.cyan.bold('Data added successfully into schedule!'))
    req.flash('success', 'Data added successfully into schedule!')
    res.redirect('/planning')
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
    console.log(chalk.cyan.bold('trainer info inserted'))
    req.flash('success', 'Trainer info added successfully!')
    res.redirect('/')
  })
})
app.post('/entreprises', (req,res,next) => {
  let company, company_adress, contact_name, contact_info, sql;
  company = req.body.company;
  company_adress = req.body.company_adress;
  contact_name = req.body.contact_name;
  contact_info = req.body.contact_info;
  sql = `INSERT INTO companies (company, company_adress, contact_name, contact_info) VALUES ("${company}", "${company_adress}", "${contact_name}", "${contact_info}")`;
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log(chalk.cyan.bold('company info inserted'))
    req.flash('success', 'Company info added successfully!')
    res.redirect('/entreprises')
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

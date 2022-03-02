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
// Handlebars helpers
hbs.registerHelper("substringOfDate", function(mydate) {
    return mydate.substring(0, 16);
});
// End hbs helpers
// Create the Calendar
const createThePlanning = (planningByMonth, resultFromDb) => {
  let objectForEachMonth = {}
  let objectForAllMonths = {}
  let countDaysInMonth = 0
  for(let i=0; i<=11; i++){
    for(let j=0; j<months.length; j++){
      if(i === j){
        countDaysInMonth = 32 - new Date(2022, i, 32).getDate();
        objectForAllMonths[months[j]] = countDaysInMonth;
        countDaysInMonth = 0
      }
    }
  }
  let objMonth = {};
  let newObjectForAllMonths = {}
  Object.values(objectForAllMonths).forEach((item, index) => {
    for(let j=0; j<Object.keys(objectForAllMonths).length; j++){
      if(index === j){
        for(let i=1; i<=item; i++){
          let theDate = new Date(2022, j, i);
          objMonth[theDate] = []
        }
        newObjectForAllMonths[Object.keys(objectForAllMonths)[j]] = objMonth
        objMonth = {}
      }
    }
  })
  let newGroupedByMonth = {}
  Object.values(resultFromDb).forEach((item, index) => {
    for(let i=0; i<Object.keys(resultFromDb).length; i++){
      if(i === index){
        newGroupedByMonth[Object.keys(resultFromDb)[i]] = groupBy(item, 'date');
      }
    }
  })
  // sort the classes by time from earliest to latest if there are few classes same day
  const sortHours = (elem) => {
    Object.values(elem).forEach((month) => {
      Object.values(month).forEach((day) => {
        if(day.length > 1){
          day.sort((a, b) => a.time - b.time)
        }
      })
    })
  }
  sortHours(newGroupedByMonth);

  for(let i=0; i<Object.keys(newObjectForAllMonths).length; i++){
    for(let j=0; j<Object.keys(newGroupedByMonth).length; j++){
      if(Object.keys(newObjectForAllMonths)[i] === Object.keys(newGroupedByMonth)[j]){
        for(let x=0; x<Object.values(newGroupedByMonth).length; x++){
          for(let a=0; a<Object.keys(Object.values(newGroupedByMonth)[x]).length; a++){
            for(let y=0; y<Object.values(newObjectForAllMonths).length; y++){
              for(let b=0; b<Object.keys(Object.values(newObjectForAllMonths)[y]).length; b++){
                if(Object.keys(Object.values(newObjectForAllMonths)[y])[b] === Object.keys(Object.values(newGroupedByMonth)[x])[a]){
                  for(let c=0; c<Object.values(Object.values(newGroupedByMonth)[x]).length; c++){
                    if(a === c){
                      Object.values(newObjectForAllMonths)[y][Object.keys(Object.values(newObjectForAllMonths)[y])[b]] = Object.values(Object.values(newGroupedByMonth)[x])[c]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  // The Calendar 2022

  for(let i=0; i<Object.keys(newObjectForAllMonths).length; i++){
    for(let j=0; j<Object.values(newObjectForAllMonths).length; j++){
      if((planningByMonth === Object.keys(newObjectForAllMonths)[i]) && (i === j)){
        objectForEachMonth[Object.keys(newObjectForAllMonths)[i]] = Object.values(newObjectForAllMonths)[j]
      }
    }
  }
  formatedTime(Object.values(Object.values(Object.values(objectForEachMonth))[0]))

  return objectForEachMonth
}
// END CALENDAR

// Format the time
const formatedTime = (anArr) => {
  anArr.forEach((item) => {
    item.forEach((elem)=>{
      var time = elem.time.toLocaleTimeString('fr-FR');
      elem.time = time.slice(0,5)
    })
  })
  return anArr
}
//
/*** Function to create an object grouped by Month for Calendar ***/
let startOfClasses = [];
const createCalendarGroupedByMonths = (result) => {
  let daysOfWeek = [];
  (()=>{
    for(let i=0; i<result.length; i++){
      //startOfClasses.push(moment(result[i].time).local('fr').format('LT'));
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
}
//
app.get('/', (req,res,next) => {
  let sql = 'SELECT * FROM trainers ORDER BY fname'
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
      let trainerPersoPlanning = groupBy(result, 'choose_months');
      let email, mobile, trainerid, name, fname;
      let countClasses = []
      let objByMonth = {}
      let objForAllClasses = {}
      let objForSalary = {}
      let countYoga = 0;
      let countPilates = 0;
      let countOtherClasses =0;
      let countVideos = 0;
      let countTotal = 0;
      for(let j=0; j<Object.keys(trainerPersoPlanning).length; j++){
        for(let i=0; i<Object.values(trainerPersoPlanning).length; i++){
          if(i === j){
            objByMonth[Object.keys(trainerPersoPlanning)[j]] = objForAllClasses
            for(let y=0; y<Object.values(Object.values(trainerPersoPlanning)[i]).length; y++){
              name = Object.values(Object.values(trainerPersoPlanning)[i])[y].name
              fname = Object.values(Object.values(trainerPersoPlanning)[i])[y].fname
              email = Object.values(Object.values(trainerPersoPlanning)[i])[y].email
              mobile = Object.values(Object.values(trainerPersoPlanning)[i])[y].mobile
              trainerid = Object.values(Object.values(trainerPersoPlanning)[i])[y].trainer_id
              Object.keys(objByMonth).forEach((month) => {
                if(Object.values(Object.values(trainerPersoPlanning)[i])[y].choose_months === month){
                  if(Object.values(Object.values(trainerPersoPlanning)[i])[y].yoga) countYoga += parseInt(Object.values(Object.values(trainerPersoPlanning)[i])[y].yoga, 10);
                  if(Object.values(Object.values(trainerPersoPlanning)[i])[y].pilates)countPilates += parseInt(Object.values(Object.values(trainerPersoPlanning)[i])[y].pilates, 10);
                  if(Object.values(Object.values(trainerPersoPlanning)[i])[y].other_classes)countOtherClasses += parseInt(Object.values(Object.values(trainerPersoPlanning)[i])[y].other_classes, 10);
                  if(Object.values(Object.values(trainerPersoPlanning)[i])[y].video)countVideos += parseInt(Object.values(Object.values(trainerPersoPlanning)[i])[y].video, 10);
                  if(Object.values(Object.values(trainerPersoPlanning)[i])[y].total_classes)countTotal += parseInt(Object.values(Object.values(trainerPersoPlanning)[i])[y].total_classes, 10);
                  objByMonth[month] = {
                    "yoga": countYoga,
                    "pilates": countPilates,
                    "other_classes": countOtherClasses,
                    "video": countVideos,
                    "total": countTotal
                  }
                }
              })
            }
          }
        }
        countYoga = 0;
        countPilates = 0;
        countOtherClasses = 0;
        countTotal = 0;
        countVideos = 0;
      }
//Clone object with number of classes to countSalary

    const salaryByMonth = Object.assign({}, JSON.parse(JSON.stringify(objByMonth)))
    Object.values(salaryByMonth).forEach((theclass) => {
      let sum = 0;
      if(theclass['yoga']){
        theclass['yoga'] = theclass['yoga'] * 50;
        sum += parseInt(theclass['yoga'], 10);
      }
      if(theclass['pilates']){
        theclass['pilates'] = theclass['pilates'] * 40;
        sum += parseInt(theclass['pilates'], 10);
      }
      if(theclass['other_classes']){
        theclass['other_classes'] = theclass['other_classes'] * 30;
        sum += parseInt(theclass['other_classes'], 10);
      }
      if(theclass['video']){
        theclass['video'] = theclass['video'] * 30;
        sum += parseInt(theclass['video'], 10);
      }
      if(theclass['total']){
        theclass['total'] = sum
      }
    })
    // Group by day trainerPersoPlanning
    Object.values(trainerPersoPlanning).forEach((month, monthindex) => {
      if(month.length > 1){
        month.sort((a,b) => a.date - b.date)
      }
      console.log(chalk.cyan.bold(util.inspect(month)))
      Object.keys(trainerPersoPlanning).forEach((key, keyindex) => {
        if(monthindex === keyindex){
          trainerPersoPlanning[key] = groupBy(month, 'date')

        }
      })
    })
    Object.values(trainerPersoPlanning).forEach((item) => {
      formatedTime(Object.values(item));
    })
    res.render('trainer', {
        title: trainerId,
        result: trainerPersoPlanning,
        email: email,
        mobile: mobile,
        name: name,
        fname: fname,
        trainerid: trainerid,
        allClasses: objByMonth,
        allSalaries: salaryByMonth
      })
    }
  })
})
app.get('/trainersplanning/:id', (req,res,next) => {
  const jan = new Date(2022, 1, 1)
  let today = new Date()
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let firstDay = (new Date(currentYear, currentMonth)).getDay();
  let daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate();
  let options = { month: 'long'};
  let formatedMonth = new Intl.DateTimeFormat('fr-FR', options).format(today)
  formatedMonth = formatedMonth.charAt(0).toUpperCase() + formatedMonth.slice(1);
  let trainerId = req.params.id
  conn.query('SELECT * FROM trainers t WHERE t.username = ?; SELECT company FROM companies ORDER BY company; SELECT * FROM trainers', [trainerId, 1, 2, 3], function(err, result){
    if (err) throw err;
    else{
      let company = result[1]
      let listOfAllTrainers = result[2]
      res.render('trainersplanning', {
        title: trainerId,
        result: result[0],
        company: company,
        months: months,
        years: years,
        currentMonth: formatedMonth,
        currentYear: currentYear,
        listOfAllTrainers: listOfAllTrainers
      })
    }
  })
})
app.get('/planning', (req,res,next) => {
  res.render('planning', {
    title: 'Planning',
    months: months
  })
})
app.get('/plannings/:id', (req,res,next) => {
  let planningByMonthID = req.params.id
  let today = new Date();
  let sql = 'SELECT * FROM schedule'
  conn.query(sql, function (err, result) {
    if (err) throw err;
    else{
      let groupedByMonth = groupBy(result, 'choose_months');
      const allTheMonths = createThePlanning(planningByMonthID, groupedByMonth);
      res.render('plannings', {
        result: result,
        objectForEachMonth: allTheMonths,
        title: 'planning !',
        message: 'Les données ont été rajoutée. Merci et à la prochaine!',
        timeOfClass: startOfClasses,
        currentYear: today.getFullYear(),
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
      let groupedByMonths = groupBy(result, 'choose_months')
      /*

      let objForClass = {
        "class": [],
        "time": '',
        "trainer": ''
      }
      for(let day in groupedByMonths){
        groupedByMonths[day] = groupBy(groupedByMonths[day], 'date')
        for(const classes in groupedByMonths[day]){
          groupedByMonths[day][classes] = groupedByMonths[day][classes].map(function(item){
            objForClass.class = [{"yoga": item.yoga}, {"pilates": item.pilates}];
            objForClass.time = item.time;
            objForClass.trainer = item.name +  ' ' + item.fname;
            day = objForClass;
            objForClass = {
              "class": [],
              "time": '',
              "trainer": ''
            }
            return day
          })

        }

      }

      for(const key in groupedByMonths){

        for(const seckey in groupedByMonths[key]){
          groupedByMonths[key][seckey].forEach((item) => {

          })

        }
      }
      */
      console.log(chalk.yellow.bold(util.inspect(groupedByMonths)))
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
    res.redirect('back')
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
app.post('/trainer/:id', (req,res,next) => {
  let idput, nameput, fnameput, usernameput, emailput, mobileput, sqlput;
  idput = req.body.idput;
  nameput = req.body.nameput;
  fnameput = req.body.fnameput;
  usernameput = req.body.usernameput;
  emailput = req.body.emailput;
  mobileput = req.body.mobileput;
  sqlput = `UPDATE trainers t1, schedule t2 SET t2.name = "${nameput}", t2.fname = "${fnameput}", t1.name = "${nameput}", t1.fname = "${fnameput}", t1.username = "${usernameput}", t1.email = "${emailput}", t1.mobile = "${mobileput}" WHERE t1.id = t2.trainer_id and t1.id = ?`;
  conn.query(sqlput, [idput], function(err, result){
    if(err) throw err;
    console.log(chalk.yellow.bold('trainer info updated'))
    req.flash('success', 'Trainer info updated successfully!')
    res.redirect(`/trainer/${usernameput}`)
  })
})
app.post('/entreprises', (req,res,next) => {
  console.log(chalk.yellow.bold(util.inspect(req.body)))
  if(req.body.idput){
    const companyUpdateId = req.body.idput;
    console.log(chalk.bold.red("update"))
    let companyput, company_adressput, contact_nameput, contact_infoput, sql;
    companyput = req.body.companyput;
    company_adressput = req.body.company_adressput;
    contact_nameput = req.body.contact_nameput;
    contact_infoput = req.body.contact_infoput;
    sql = `UPDATE companies SET company = "${companyput}", company_adress = "${company_adressput}", contact_name = "${contact_nameput}", contact_info = "${contact_infoput}" WHERE id = ?`;
    conn.query(sql, [companyUpdateId], function (err, result) {
      if (err) throw err;
      console.log(chalk.cyan.bold('company info updated'))
      req.flash('success', 'Company info updated successfully!')
      res.redirect('/entreprises')
    })
  }else{
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
  }
})
app.get('/delete/:id', (req,res,next) => {
  const id= req.params.id;
  const sql = 'DELETE FROM companies WHERE id = ?';
  conn.query(sql, [id], function (err, data) {
  if (err) throw err;
  console.log(chalk.bold.green.bgWhite("company was deleted"));
});
res.redirect('/entreprises');
})
app.get('/deleteclass/:id', (req,res,next) => {
  const id= req.params.id;
  const sql = 'DELETE FROM schedule WHERE id = ?';
  conn.query(sql, [id], function (err, data) {
    if (err) throw err;
    console.log(chalk.bold.green.bgWhite("class was deleted"));
  });
  res.redirect('back');
})
app.get('/deletetrainerdata/:id', (req,res,next) => {
  const id= req.params.id;
  const sql = 'DELETE FROM trainers WHERE id = ?';
  conn.query(sql, [id], function (err, data) {
    if (err) throw err;
    console.log(chalk.bold.cyan.bgWhite("trainers personal info was deleted"));
  });
res.redirect('back');
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

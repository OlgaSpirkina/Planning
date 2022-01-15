import mysql from 'mysql'

let conn = mysql.createConnection({
  /*
  connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'Budget',
  debug    : false,
  timezone : 'cet'
  */
  host: 'localhost',
  user: 'root',
  password: '24112411',
  database: 'planning'

});

conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
export default conn;

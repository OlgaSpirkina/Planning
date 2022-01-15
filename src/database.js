import mysql from 'mysql'

let conn = mysql.createConnection({
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

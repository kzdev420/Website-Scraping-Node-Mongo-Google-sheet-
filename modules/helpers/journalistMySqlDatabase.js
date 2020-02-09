var mysql = require("mysql");
var pool = mysql.createPool({
  host: process.env.CLEARDB_URL,
  user: process.env.CLEARDB_USER,
  database: process.env.CLEARDB_DATABASE, 
  password: process.env.CLEARDB_PASSWORD, 
});
var journalistMySqlDatabase = {};
journalistMySqlDatabase.findAuthors = function(author, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      callback(true);
      return;
    }
    var sql = "SELECT * FROM journalists WHERE First_name LIKE '" + author.First_name + "%' AND Last_name LIKE '" + author.First_name + "%' AND Domain_name LIKE '" + author.Domain_name + "%'";
    connection.query(sql, function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if (err) {
        console.log(err);
        callback(true);
        return;
      }

      callback(false, results);
    });
  });
};

journalistMySqlDatabase.testFindAuthors = function(author, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      callback(true);
      return;
    }
    var sql = "SELECT * FROM journalists WHERE First_name LIKE 'A.J.%' AND Last_name LIKE 'Chavar%' AND Domain_name LIKE 'Vox%'";
    connection.query(sql, function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if (err) {
        console.log(err);
        callback(true);
        return;
      }

      callback(false, results);
    });
  });
};

journalistMySqlDatabase.updateAuthor = function(author, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      callback(true);
      return;
    }
    console.log("AUTHOR KEYWORDS", author.keywords);
    var sql = `UPDATE journalists SET Contact_Topic="${author.keywords}" WHERE id= ${author.id}`;
    connection.query(sql, function(err, result) {
      console.log(result);
      connection.release(); // always put connection back in pool after last query
      if (err) {
        console.log(err);
        callback(true);
        return;
      }
      callback(false, result.insertId);
    });
  });
};

journalistMySqlDatabase.saveAuthor = function(author, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      callback(true);
      return;
    }
    var sql = `INSERT INTO journalists (First_name, Last_name, Domain_name) VALUES ('${author.First_name}', '${author.Last_name}', '${author.Domain_name}')`;
    connection.query(sql, function(err, result) {
      connection.release(); // always put connection back in pool after last query
      if (err) {
        console.log(err);
        callback(true);
        return;
      }
      callback(false, result);
    });
  });
};

module.exports = journalistMySqlDatabase;

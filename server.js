//import mySQL
const mysql = require('mysql12');
//import inquirer
const inquirer = require('inquirer');
//import console.table
const table = require('console.table');
//use .env 
require('dotenv').config();


//connect to sql database
const connection = mysql.CreateConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId)
    postConnection();
});

//welcome image after connection is made
postConnection = () => {
    console.log("****************************")
    console.log("*     EMPLOYEE MANAGER     *")
    console.log("****************************")
    promptUser();
}

//
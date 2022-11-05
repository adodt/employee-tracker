//import mysql, inquirer, dotenv, console.table
const mysql = require ('mysql12');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();


//connect to database
const connection = mysql.CreateConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'employee_db'
});
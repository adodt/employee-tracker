//import inquirer
const inquirer = require('inquirer');
//import console.table
const table = require('console.table');
//import sequelize
const connection = require('./config/connection')

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

//initial question
const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View departments',
                'View all roles',
                'View all employees',
                'Add department',
                'Add a role',
                'Add an employee',
                'Update employee role',
                'Update employee manager',
                'Delete entire department',
                'Delete role',
                'Delete specific employee',
                'Nothing']
        }
    ])

        .then((answers) => {
            const { choices } = answers;

            if (choices === "View departments") {
                viewDepartments();
            }
        })

};


//view all departments function
viewDepartments = () => {
    console.log('All Departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        promptUser();
    });


}
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
    console.log("*     EMPLOYEE TRACKER     *")
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

            if (choices === "View roles") {
                showRoles();
            }

            if (choices === "Add department") {
                addDepartment();
            }
        })

};


//view all departments function
viewDepartments = () => {
    console.log('All Departments...\n');
    const sql = 'SELECT department.id AS id, department.name AS department FROM department';

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows)
        promptUser();
    });
}

//add department function
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: "What is the name of the department you would like to add?",
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Enter name of department you would like to add');
                }
            }
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO department (name)
        VALUES (?)`;
            connection.query(sql, answer.addDept, (err, result) => {
                if (err) throw err;
                console.log("Added  " + answer.addDept + " to the department.");

                viewDepartments();
            });
        });
};

// show all roles funcition
showRoles = () => {
    console.log('Show all roles...\n');
    
    const sql = `SELECT role.id, role.title, department.name AS department
                FROM role
                INNER JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    })
};
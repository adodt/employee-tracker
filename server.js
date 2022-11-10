//import inquirer
const inquirer = require('inquirer');
//import console.table
const table = require('console.table');
//import sequelize
const connection = require('./config/connection');
const { query } = require('./config/connection');

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
                'View roles',
                'View all employees',
                'Add department',
                'Add a role',
                'Add an employee',
                'Update employee role',
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

            if (choices === "Update employee role") {
                updateRole();
            }

            if (choices === "View all employees") {
                viewEmployees();
            }

            if (choices === "Add an employee") {
                addEmployee();
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

// update employee role
updateRole = () => {
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])

            .then(employeeChoice => {
                const employee = employeeChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM role`;

                connection.query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is their new role?',
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;


                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                viewEmployees();
                            })
                        })
                })
            })
    })
};

//view all employees function
viewEmployees = () => {
    console.log('Viewing all employees...\n');
    const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name AS department,
                role.salary,
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
            FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });

};

//Add employee to team function
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the name of the employee?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Enter first name before proceeding');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the last name of the employee? you are adding?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name before proceeding');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.firstName, answer.lastName]

            const roleSql = `SELECT role.id, role.title FROM role`;

            connection.query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What role would you like to assign?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        params.push(role);

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log("Employee has been added!")

                            viewEmployees();
                        })
                    })
            })
        })

}
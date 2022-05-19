const inquirer = require("inquirer");
const fs = require("fs");
const cTable = require("console.table");
require("dotenv").config();
const db = require("./db/connection.js");
const { resolvePtr } = require("dns");

const PORT = process.env.PORT || 3001;

function showMainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "main",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answer) => {
      const userChoice = answer.main;
      console.log(answer);
      switch (userChoice) {
        case "View all departments":
          db.query("SELECT * FROM department", function (err, results) {
            console.table(results);
            showMainMenu();
          });
          break;
        case "View all roles":
          db.query(
            "SELECT role_info.id, title, salary, dept_name AS department FROM role_info INNER JOIN department ON role_info.department_id = department.id",
            function (err, results) {
              console.table(results);
              showMainMenu();
            }
          );
          break;
        case "View all employees":
          db.query(
            "SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role_info.title as job_title, department.dept_name, role_info.salary, manager.first_name as manager_first_name, manager.last_name as manager_last_name FROM employee INNER JOIN role_info ON role_info.id = employee.role_id LEFT JOIN department ON department.id = employee.id INNER JOIN employee as manager ON employee.manager_id = manager.id",
            function (err, results) {
              console.table(results);
              showMainMenu();
            }
          );
          break;
        case "Add a department":
          console.log(userChoice);
          inquirer
            .prompt([
              {
                type: "input",
                message: "Which department would you like to add?",
                name: "deptname",
              },
            ])
            .then((userAnswer) => {
              console.log(userAnswer);
              db.query(
                "INSERT INTO department (dept_name) VALUES (?)",
                userAnswer.deptname,
                function (err, results) {
                  db.query("SELECT * FROM department", function (err, results) {
                    console.table(results);
                    showMainMenu();
                  });
                }
              );
            });
          break;

        case "Add a role":
          console.log(userChoice);
          let department = [];
          db.query("SELECT * FROM department", function (err, results) {
            results.forEach((result) => {
              department.push({
                name: result.dept_name,
                value: result.id,
              });
            });
          });

          inquirer
            .prompt([
              {
                type: "input",
                message: "Enter job role title",
                name: "roletitle",
              },
              {
                type: "input",
                message: "Enter job role salary",
                name: "salary",
              },
              {
                type: "list",
                message: "Enter job role department",
                name: "department_id",
                choices: department,
              },
            ])
            .then((userAnswer) => {
              console.log(userAnswer);

              db.query(
                "INSERT INTO role_info (title, salary, department_id) VALUES (?,?,?)",
                [
                  userAnswer.roletitle,
                  userAnswer.salary,
                  userAnswer.department_id,
                ],
                function (err, results) {
                  db.query("SELECT * FROM role_info", function (err, results) {
                    console.table(results);
                    showMainMenu();
                  });
                }
              );
            });
          break;

        case "Add an employee":
          console.log(userChoice);
          let role = [];
          db.query("SELECT * FROM role_info", function (err, results) {
            results.forEach((result) => {
              role.push({
                name: result.title,
                value: result.id,
              });
            });
            let manager = [];
            db.query("SELECT * FROM employee", function (err, results) {
              results.forEach((result) => {
                manager.push({
                  name: result.first_name,
                  value: result.id,
                });
              });

              inquirer
                .prompt([
                  {
                    type: "input",
                    message: "Enter employee's first name",
                    name: "employeefirst",
                  },
                  {
                    type: "input",
                    message: "Enter employee's last name",
                    name: "employeelast",
                  },
                  {
                    type: "list",
                    message: "Enter employee's role",
                    name: "employeerole",
                    choices: role,
                  },
                  {
                    type: "list",
                    message: "Enter employee's manager",
                    name: "employeemanager",
                    choices: manager,
                  },
                ])
                .then((userAnswer) => {
                  console.log(userAnswer);
                  db.query(
                    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
                    [
                      userAnswer.employeefirst,
                      userAnswer.employeelast,
                      userAnswer.employeerole,
                      userAnswer.employeemanager,
                    ],
                    function (err, results) {
                      db.query(
                        "SELECT employee.first_name, employee.last_name, employee.manager_id, role_info.title, manager.first_name AS manager FROM employee LEFT JOIN role_info ON employee.role_id = role_info.id LEFT JOIN employee manager ON manager.id = employee.manager_id",
                        function (err, results) {
                          console.table(results);
                          showMainMenu();
                        }
                      );
                    }
                  );
                });
            });
          });
          break;

        case "Update an employee role":
          console.log(userChoice);
          let roles = [];
          db.query("SELECT * FROM role_info", function (err, results) {
            results.forEach((result) => {
              roles.push({
                name: result.title,
                value: result.id,
              });
            });
            console.log(roles);
            let employees = [];
            db.query("SELECT * FROM employee", function (err, results) {
              results.forEach((result) => {
                employees.push({
                  name: result.first_name,
                  value: result.id,
                });
              });
              console.log(employees);

              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "Which employee's role would you like to update?",
                    name: "employees",
                    choices: employees,
                  },
                  {
                    type: "list",
                    message: "What is the name of the new role?",
                    name: "newrole",
                    choices: roles,
                  },
                ])
                .then((userAnswer) => {
                  console.log(userAnswer);
                  db.query(
                    "UPDATE employee SET role_id = ? WHERE id = ?",
                    [userAnswer.newrole, userAnswer.employees],
                    function (err, results) {
                      db.query(
                        "SELECT employee.first_name, employee.last_name, role_info.title FROM employee LEFT JOIN role_info ON employee.role_id = role_info.id LEFT JOIN employee manager ON manager.id = employee.manager_id",
                        function (err, results) {
                          console.table(results);
                          showMainMenu();
                        }
                      );
                    }
                  );
                });
            });
          });
          break;
      }
    });
}
showMainMenu();

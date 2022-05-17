const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: process.env.PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

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
            "SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role_info.title as job_title, role_info.department_id, role_info.salary, employee.manager_id FROM employee INNER JOIN role_info ON role_info.id = employee.role_id", //left join
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
          console.log("I own a dog");
          break;
        case "Add an employee":
          console.log("I own a dog");
          break;
        case "Update an employee role":
          console.log("I own a dog");
          break;
      }
    });
}
showMainMenu();

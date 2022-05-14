const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const cTable = require("console.table");

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
      const viewDept = answer.main;
      console.log(answer);
      if (viewDept === "View all departments") {
        db.query("SELECT * FROM department", function (err, results) {
          console.table(results);
        });
      }
    });
}

showMainMenu();

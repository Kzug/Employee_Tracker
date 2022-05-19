USE employee_db;

INSERT INTO department (dept_name)  
VALUES
("Research Dept"),
("Marketing Dept"),
("Sales Dept");

INSERT INTO role_info (department_id, title, salary)
VALUES 
(1, "Research Assistant", 30.000),
(2, "Ad Designer", 40.000),
(3, "Salesman", 50.000);

INSERT into employee (role_id, first_name, last_name, manager_id)
VALUES
(1, "John", "Doe", 1),
(2, "Pam", "Beasley", 1),
(3, "Dwight", "Shrute", 1);
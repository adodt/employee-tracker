INSERT INTO department (name)
VALUES
('Marketing'),
('Sales'),
('Operations'),
('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
('Director of Digital Experience', 98000, 1);
('Social Media Manager', 85000, 1),
('Director of Marketing', 100000, 1),
('Floor Sales', 44000, 2),
('Sales Lead', 68000, 2),
('CEO', 110000, 3),
('Project Manager', 890000, 3),
('Accountant', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Sam', 'Dodt', 1, null),
('Robby', 'Arnold', 2, 1),
('Rebecca', 'Michelle', 3, null),
('Bobby', 'Johnson', 4, 5),
('Ashley', 'Abbey', 5, 4),
('Kody', 'Berkley', 6, null),
('Emily', 'Alvarez', 7, 6),
('Julia', 'Collura', 1, null);

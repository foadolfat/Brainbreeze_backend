Create database if not exists nerdjs;
use nerdjs;

/*
drop table quizzes;
drop table units; 
drop table lessons;
drop table modules;
drop table classes;
drop table user_table;
*/

create table user_table 
(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL,
    user_email VARCHAR(50),
    unique(user_email),
    user_password VARCHAR(150) NOT NULL,
    user_type VARCHAR(30)
);
create table classes
(
    class_id CHAR(36) NOT NULL,
    user_class BIGINT NOT NULL REFERENCES user_table(user_id),
    class_name VARCHAR(40) NOT NULL,
    class_descrip VARCHAR(100),
    UNIQUE(class_name, user_class),
    unique key class_key (class_id, user_class)
);
create table modules
(
  module_id SERIAL PRIMARY KEY,
  module_name VARCHAR(40) NOT NULL,
  module_descrip VARCHAR(100),
  instructor_id BIGINT NOT NULL REFERENCES user_table(user_id),
  class_id CHAR(36) NOT NULL REFERENCES classes(class_id)
); 
create table lessons
(
  lesson_id SERIAL PRIMARY KEY,
  lesson_name VARCHAR(30),
  lesson_descrip VARCHAR(100),
  lesson_index INT,
  instructor_id BIGINT NOT NULL REFERENCES user_table(user_id),
  module_id INT REFERENCES modules(module_id)
);
create table units
(
	unit_id SERIAL PRIMARY KEY,
	unit_index INT,
	unit_name VARCHAR(30),
	unit_content VARBINARY(500),
  instructor_id BIGINT NOT NULL REFERENCES user_table(user_id),
	lesson_id INT REFERENCES lessons(lesson_id)
);
create table quizzes
(
	quiz_id SERIAL PRIMARY KEY,
	quiz_index INT,
	quiz_name VARCHAR(30),
	quiz_type VARCHAR(15),
	quiz_content VARBINARY(500),
	quiz_answers VARBINARY(500),
  instructor_id BIGINT NOT NULL REFERENCES user_table(user_id),
	unit_id INT REFERENCES units(unit_id)
);
Create database if not exists nerdjs;
use nerdjs;

drop table units; 
drop table lessons;
drop table modules;
drop table classes;
drop table user_table;

create table user_table 
(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL,
    user_email VARCHAR(50),
    user_password BINARY(60) NOT NULL,
    user_type VARCHAR(30)
);
create table classes
(
    class_id SERIAL NOT NULL,
    user_class BIGINT NOT NULL REFERENCES user_table(user_id),
    class_name VARCHAR(40) NOT NULL,
    class_descrip VARCHAR(100),
    unique key class_key (class_id, user_class)
);
create table modules
(
  module_id SERIAL PRIMARY KEY,
  module_name VARCHAR(40) NOT NULL,
  module_descrip VARCHAR(100),
  class_id INT REFERENCES classes(class_id)
); 
create table lessons
(
  lesson_id SERIAL PRIMARY KEY,
  lesson_name VARCHAR(30),
  lesson_descrip VARCHAR(100),
  lesson_index INT,
  module_id INT REFERENCES modules(module_id)
);
create table units
(
	unit_id SERIAL PRIMARY KEY,
	unit_index INT,
	unit_name VARCHAR(30),
	unit_content VARBINARY(500),
	lesson_id INT REFERENCES lessons(lesson_id)
);
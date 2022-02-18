Create database if not exists nerdjs;
use nerdjs;

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
    class_id INT PRIMARY KEY,
    class_name VARCHAR(40) NOT NULL,
    class_descrip VARCHAR(100),
    user_class BIGINT NOT NULL REFERENCES user_table(user_id)
);
create table modules
(
  module_id INT PRIMARY KEY,
  module_name VARCHAR(40) NOT NULL,
  module_descrip VARCHAR(100),
  class_id INT REFERENCES classes(class_id)
); 
create table lessons
(
  lesson_id INT PRIMARY KEY,
  lesson_name VARCHAR(30),
  lesson_descrip VARCHAR(100) ,
  module_id INT REFERENCES modules(module_id)
);

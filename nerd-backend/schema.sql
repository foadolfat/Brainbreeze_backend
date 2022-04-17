Create database if not exists nerdjs;
use nerdjs;

drop table progress;
drop table scores;
drop table quizdata;
drop table quizzes;
drop table units; 
drop table lessons;
drop table modules;
drop table classes;
drop table user_table;
drop view class_units;
drop view module_units;
drop view progression_creation;


create table user_table 
(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL,
    user_email VARCHAR(50),
    user_pp MEDIUMBLOB,
    user_bio TEXT,
    unique(user_email),
    user_password VARCHAR(150) NOT NULL,
    user_type VARCHAR(30) NOT NULL
);
create table classes
(
    class_id CHAR(36) NOT NULL,
    user_class BIGINT UNSIGNED NOT NULL,
    class_name VARCHAR(40) NOT NULL,
    class_descrip VARCHAR(100),
    instructor_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES user_table(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_class) REFERENCES user_table(user_id),
    UNIQUE(class_name, user_class),
    unique key class_key (class_id, user_class)
);
create table modules
(
	module_id SERIAL PRIMARY KEY,
	module_name VARCHAR(40) NOT NULL,
	module_descrip VARCHAR(100),
	instructor_id BIGINT UNSIGNED NOT NULL,
	class_id CHAR(36) NOT NULL,
	FOREIGN KEY (instructor_id) REFERENCES user_table(user_id) ON DELETE CASCADE,
	FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
); 
create table lessons
(
	lesson_id SERIAL PRIMARY KEY,
	lesson_name VARCHAR(30),
	lesson_descrip VARCHAR(100),
	lesson_index INT,
	instructor_id BIGINT UNSIGNED NOT NULL,
	module_id BIGINT UNSIGNED NOT NULL,
	FOREIGN KEY (instructor_id) REFERENCES user_table(user_id) ON DELETE CASCADE,
	FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE CASCADE
);
create table units
(
	unit_id SERIAL PRIMARY KEY,
	unit_index INT,
	unit_name VARCHAR(30),
	unit_content_type VARCHAR(65535),
	unit_content VARCHAR(65535),
	lesson_id BIGINT UNSIGNED NOT NULL,
	instructor_id BIGINT UNSIGNED NOT NULL,
	FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE,
	FOREIGN KEY (instructor_id) REFERENCES user_table(user_id) ON DELETE CASCADE
);
create table quizzes
(
	quiz_id SERIAL PRIMARY KEY,
	quiz_name VARCHAR(50),
	instructor_id BIGINT UNSIGNED NOT NULL,
	unit_id BIGINT UNSIGNED NOT NULL,
	FOREIGN KEY (instructor_id) REFERENCES user_table(user_id) ON DELETE CASCADE,
	FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE CASCADE
);

create table quizdata
(
	quizdata_id SERIAL PRIMARY KEY,
	quizdata_question TEXT,
	quizdata_answers JSON,
	quiz_id BIGINT UNSIGNED NOT NULL,
	FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

create table scores
(
	user_id BIGINT NOT NULL REFERENCES user_table(user_id),
	quiz_id INT NOT NULL REFERENCES quizzes(quiz_id),
	instructor_id BIGINT NOT NULL REFERENCES user_table(user_id),
    class_id BIGINT NOT NULL REFERENCES classes_table(class_id),
    lesson_id BIGINT NOT NULL REFERENCES lessons_table(lesson_id),
    module_id BIGINT NOT NULL REFERENCES modules(module_id),
    unit_id BIGINT NOT NULL REFERENCES units_table(unit_id),
	score_id SERIAL PRIMARY KEY,
	score INT,
	date_graded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	date_regraded TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	unique key score_key (user_id, quiz_id, class_id, lesson_id, module_id, score_id, unit_id, instructor_id)
);
create table progress
(
	user_id BIGINT UNSIGNED NOT NULL,
	class_id CHAR(36) NOT NULL,
	module_id BIGINT UNSIGNED NOT NULL,
	lesson_id BIGINT UNSIGNED NOT NULL,
	unit_id BIGINT UNSIGNED NOT NULL REFERENCES units(unit_id),
	instructor_id BIGINT UNSIGNED NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user_table(user_id) ON DELETE CASCADE,
	FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE CASCADE,
	FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE,
	FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE CASCADE,
	FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
	FOREIGN KEY (instructor_id) REFERENCES user_table(user_id) ON DELETE CASCADE,
	completed BOOLEAN DEFAULT 1,
	date_completed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	progress_id SERIAL PRIMARY KEY,
	unique key progress_key (user_id, class_id, module_id, lesson_id, unit_id, instructor_id)
);
create view class_units as
select c.class_id, u.unit_id, u.instructor_id
from units u 
join lessons l on u.lesson_id = l.lesson_id
join modules m on l.module_id = m.module_id
join classes c on m.class_id = c.class_id;

create view module_units as
select m.module_id, u.unit_id, u.instructor_id
from units u
join lessons l on u.lesson_id = l.lesson_id
join modules m on l.module_id = m.module_id;

create view progression_creation as
select l.lesson_id, c.class_id, m.module_id, u.unit_id
from units u
join lessons l on u.lesson_id = l.lesson_id
join modules m on l.module_id = m.module_id
join classes c on m.class_id = c.class_id;


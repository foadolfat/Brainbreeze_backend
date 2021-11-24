Create database if not exists nerdjs;

Create table if not exists users (
  id serial primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  password BINARY(60) not null,
  created_at timestamp default now()
);
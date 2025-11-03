CREATE DATABASE IF NOT EXISTS task_manager;
use task_manager;


create table users (
    id int auto_increment primary key,
    username varchar(50) not null unique,
    password varchar(255) not null
);


create table teams (
    id int auto_increment primary key,
    name varchar(100) not null
);


create table tasks (
    id int auto_increment primary key,
    title varchar(255) not null,
    description text,
    assigned_to int,
    team_id int,
    status enum('pending','in-progress','done') default 'pending',
    deadline date,
    created_at timestamp default current_timestamp,
    foreign key (assigned_to) references users(id) on delete set null,
    foreign key (team_id) references teams(id) on delete set null
);



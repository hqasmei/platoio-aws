-- Create the `platoio` user and `platoio` database.
-- Run as the `postgres` user in the `postgres` database.
create user platoio with encrypted password 'hosna-qasmei-is-awesome';
create database platoio with owner platoio encoding 'utf8';
grant all privileges on database platoio to platoio;

-- Install the `pgcrypto` extension in the `platoio` database.
-- This extension is required to support UUIDs as primary keys!
-- Run as the `platoio` user in the `platoio` database.
create extension pgcrypto;

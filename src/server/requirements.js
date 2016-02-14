import db from './database'
import fs from 'fs'
import settings from '../shared/settings'



export default function requirements(){
  db.exec(
 `CREATE TABLE if not exists sites (
  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  domain varchar(512) NOT NULL,
  markup varchar,
  style varchar,
  script varchar,
  title varchar(256),
  config varchar
 );
  CREATE TABLE if not exists tracking (
  domain varchar NOT NULL,
  referer varchar,
  "datetime" datetime DEFAULT(current_timestamp),
  ip_address varchar(32)
 );
  CREATE TABLE if not exists templates (
  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  name varchar(256),
  text varchar
 );
  CREATE TABLE if not exists signups (
  domain varchar(512) NOT NULL,
  email varchar(128),
  "datetime" datetime DEFAULT(current_timestamp),
  misc varchar
 );  `)

 
 // create config folder
 try {
   fs.mkdirSync('.hatchyt')
  } catch (e) {}

  try {
       fs.mkdirSync('.hatchyt/output')
  } catch (e) {}

 // check if settings are configured
  try {
    let userSettings = fs.readFileSync('.hatchyt/settings.json', {encoding: 'utf8'})
    let json = JSON.parse(userSettings)
    settings.userOptions = json
    return true
  } catch (e) {
    return false
  }
}

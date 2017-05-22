# ResDesk Lockout #
A [Swagger](https://www.npmjs.com/package/swagger) / [Sails](http://sailsjs.org) application 

## About ##

ResDesk Lockout is a simple service for tracking student lockout counts.


## Development ##

Requirements:
-  [npm](https://www.npmjs.com/)
-  [homebrew](http://brew.sh/)
-  [mongodb](https://www.mongodb.com)

Setup:
- run `npm install` to install dependencies
- run `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"` to install homebrew
- run `brew install mongodb` to install mongodb from brew
  - run `mongod` to start the local mongodb instance
  - in a new terminal window/tab, run `mongo`
  - create a local copy of the db by running `use res_desk_lockout_service`
  - create a db user to use for connections: `db.createUser({user:"res-desk-admin", pwd:"admin",roles:["readWrite","dbAdmin"]})`

Runtime:
- run `swagger project start`
- make sure mongo is running (`mongod`)

Other:
- make sure other ResDesk services are running to access their data
- [robomongo](https://robomongo.org/) is a really good tool to visualize the db

API:
- this service runs on port 10016
- [docs](http://localhost:10016/docs/index.html)

## Production ##

API:
- this service runs on port 8080

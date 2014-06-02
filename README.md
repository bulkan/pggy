## pggy
<sub>piggy</sub>

[![NPM](https://nodei.co/npm/pggy.png?downloads=true&stars=true)](https://nodei.co/npm/pggy/) [![NPM](https://nodei.co/npm-dl/pggy.png?months=3)](https://nodei.co/npm/pggy/)


Postgres terminal UI using [blessed](https://github.com/chjj/blessed) and [Knex.js](http://knexjs.org).

## Introduction

Currently a work in progress. There is a few issues & enhancements that need to be done.

See the issues in here & this [Trello board](https://trello.com/b/2bJirC2F/pggy)

## Features

* At the moment **Does not** support editing records. Hopefully it will be implemented soon. 
* viewing of tables in the database
* running raw queries


![screenshot1](https://raw.github.com/bulkan/pggy/master/images/screenshot1.png)



## Usage

`npm install -g pggy`

* There is a dependency on libpq_dev that may also need to be installed before this will complete succesfully. 

Create a `.pggyrc` file in your home (or current directory) with the following;

```json
{
    "hostname": "localhost",
    "password": "",
    "username": "bulkan",
    "database": "chinook"
}
```

## Keyboard shortcuts

While the table list has focus; 

* `d` to drop the table that is highlighted (a confirmation is shown)
* `i` to show a list of columns on the currently highlighted table
* `ENTER` to run `select * from <table>` query on the highlighted table

Anywhere;

* `ctrl + r` anywhere to jump to the raw sql text box
* `ctrl + q` to quit 


## LICENSE

MIT

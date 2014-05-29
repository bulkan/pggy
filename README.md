pggy
====

[![NPM](https://nodei.co/npm/pggy.png?downloads=true&stars=true)](https://nodei.co/npm/pggy/) [![NPM](https://nodei.co/npm-dl/pggy.png?months=3)](https://nodei.co/npm/pggy/)


Postgres terminal UI using `blessed` and `knex` js

![pgy](https://raw.github.com/bulkan/pggy/master/images/screenshot1.png)



## Usage

`npm install -g pggy`

Create a `.pggyrc` file in your home (or current directory) with the following;

```json
{
    "hostname": "localhost",
    "password": "",
    "username": "bulkan",
    "database": "chinook"
}
```


##Keyboard shortcuts

While the table list has focus; 

* `d` to drop the table that is highlighted (a confirmation is shown)
* `i` to show a list of columns on the currently highlighted table
* `ENTER` to run `select * from <table>` query on the highlighted table

Anywhere;

* `ctrl + r` anywhere to jump to the raw sql text box
* `ctrl + q` to quit 

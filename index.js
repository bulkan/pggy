var util = require('util')
  , blessed = require('blessed')
  , Knex = require('knex');

// TODO: load this info from a config file
Knex.knex = Knex.initialize({
  client: 'pg',
  connection: {
    host     : 'localhost',
    user     : 'bulkan',
    password : '',
    database : 'franq-dev',
  }
});


// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var tablesBox = blessed.list({
  width: '30%',
  height: '90%',
  content: "{center}TABLES{/center}",
  tags: true,
  scrollable: true,
  border: {
    type: 'line'
  },
  padding: {
    left: 1,
    bottom: 2
  },
  keys: true,
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      fg: '#ffffff'
    },
    hover: {
      bg: 'green'
    },
    selected: {
      fg: "white",
      bg: "black"
    }
  }
});

screen.append(tablesBox);

// store list of tables
var tables = [];
var knex = Knex.knex;

tablesBox.on('select', function(event, selectedIndex){
  var tableName = tables[selectedIndex];

  knex(tableName)
    .select()
    .then(function(rows){
    })

});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});



// load the tables in this database
knex('information_schema.tables')
  .select('table_name')
  .where({
    table_schema: 'public',
    table_type: 'BASE TABLE'
  })
  .orderBy('table_name')
  .then(function(rows){
    rows.forEach(function(row){
      tables.push(row.table_name)
    });
    tablesBox.setItems(tables);

    screen.render();
    tablesBox.focus();
  })

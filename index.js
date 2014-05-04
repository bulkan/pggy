var util = require('util')
  , blessed = require('blessed')
  , bunyan = require('bunyan')
  , _ = require('lodash')
  , Knex = require('knex');

var log = bunyan.createLogger({
  name: 'pggy',
  streams: [
    {
      'level': 'debug',
      'path': 'pggy.log'
    }
  ]
})

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
  height: '95%',
  label: "{center}tables{/center}",
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

var rawQuery = blessed.textbox({
  width: '100%',
  height: '7%',
  top: '95%',
  border: {
    type: 'line'
  },
  label: 'sql: ',
  padding: {
    left: 1,
  },
  inputOnFocus: true,
  right: '0',
  fg: 'white',
  bg: 'black',
  barBg: 'default',
  barFg: 'blue'
})

var queryResults = blessed.box({
  width: '70%',
  height: '95%',
  left: '30%',
  tags: true,
  scrollable: true,
  label: '{center}results{/center}',
  border: {
    type: 'line'
  },
  padding: {
    left: 1,
    bottom: 2
  }
});

screen.append(tablesBox);
screen.append(queryResults);
screen.append(rawQuery);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});


screen.key(['r', 'C-c'], function(ch, key) {
  rawQuery.focus();
});

// store list of tables
var tables = []
  , knex = Knex.knex;  //refence to knex instance

// load the table
tablesBox.on('select', function(event, selectedIndex){
  var tableName = tables[selectedIndex];
  log.debug('selected table:', tableName);

  knex(tableName)
    .select()
    .then(function(rows){
      if (rows.length === 0) {
        return;
      }
      var columns = _.keys(rows[0]);

      queryResults.setContent(columns.join('|'))

      _(rows).each(function(row){
        queryResults.pushLine(_.values(row).join('|'))
      })
      
      screen.render();
      log.debug(rows);
    })
});


rawQuery.on('submit', function(queryText){
  knex
    .raw(queryText)
    .then(function(resp){
      if (resp.rows.length === 0) {
        return;
      }
      var rows = resp.rows;

      var columns = _.keys(rows[0]);

      queryResults.setContent(columns.join('|'))

      _(rows).each(function(row){
        queryResults.pushLine(_.values(row).join('|'))
      })
      
      screen.render();
      log.debug(rows);
    });
})



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

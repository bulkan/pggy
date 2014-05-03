var blessed = require('blessed')
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
var box = blessed.box({
  top: 'center',
  width: '50%',
  height: '100%',
  content: "TABLES",
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#ffffff'
    },
    hover: {
      bg: 'green'
    }
  }
});

screen.append(box);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});


var knex = Knex.knex;

// load the tables in this database
knex('information_schema.tables')
  .select('table_name')
  .where({
    table_schema: 'public',
    table_type: 'BASE TABLE'
  })
  .orderBy('table_name')
  .then(function(rows){
    rows.forEach(function(row, i){
      box.setLine(i+1, row.table_name);
    });
    screen.render();

  })

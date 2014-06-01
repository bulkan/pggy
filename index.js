#!/usr/bin/env node

var util = require('util')
  , blessed = require('blessed')
  , conf = require('rc')('pggy', {})
  , bunyan = require('bunyan')
  , _ = require('lodash')
  , pgpass = require('pgpass')
  , Knex = require('knex')
  , getTableInfo = require('./lib/tableInfo')
  , getTablesList = require('./lib/tablesList')
  , getDropMenu = require('./lib/dropMenu')
  , utils;

var log = bunyan.createLogger({
  name: 'pggy',
  streams: [
    {
      'level': 'debug',
      'path': 'pggy.log'
    }
  ]
})

Knex.knex = Knex.initialize({
  client: 'pg',
  connection: {
    host     : conf.hostname,
    user     : conf.username,
    password : conf.password,
    database : conf.database,
  }
});

utils = require('./lib/utils')(Knex.knex, log);


// Create a screen object.
var screen = blessed.screen();

var searchBox = blessed.textbox({
  width: '30%',
  height: '7%',
  top: 'center',
  left: '30%',
  border: {
    type: 'line',
    fg: 'blue'
  },
  label: 'table search',
  padding: {
    left: 1,
  },
  inputOnFocus: true,
  right: '0',
  fg: 'white',
  bg: 'black',
});


var tablesList = getTablesList(searchBox, screen, log);

var tableInfo = getTableInfo();

tableInfo.key('escape', function(){
  tableInfo.hide();
  tablesList.focus();
  screen.render();
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
  barFg: 'blue',
  vi: true
});

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


searchBox.hide();
tableInfo.hide();

screen.append(tablesList);
screen.append(queryResults);
screen.append(rawQuery);
screen.append(searchBox);
screen.append(tableInfo);

// Quit on Escape, q, or Control-C.
screen.key(['C-q'], function(ch, key) {
  return process.exit(0);
});


screen.key(['r', 'C-r'], function(ch, key) {
  rawQuery.focus();
});

// store list of tables
var tables = [],
    knex = Knex.knex;  //refence to knex instance



// load the table
tablesList.on('select', function(event, selectedIndex){
  var tableName = tables[selectedIndex];
  log.debug('selected table:', tableName);

  knex(tableName)
    .select()
    .then(function(rows){
      if (rows.length === 0) {
        return;
      }
      var columns = _.keys(rows[0]);

      queryResults.setText(utils.getTable(columns, rows));
      
      screen.render();
      log.debug(rows);
    })
    .catch(function(err){
      log.error(err);
    });
});

tablesList.key('i', function(event){
  var selectedIndex = tablesList.selected;
  var tableName = tablesList.getItem(tablesList.selected).content;
  utils.getTableColumns(tableName)
    .then(function(cols){
      tableInfo.setItems(cols);
      tableInfo.focus();
      tableInfo.show();
      screen.render();
    });
})

var dropMenu = getDropMenu(log, screen);

dropMenu.submit.on('press', function(event){
  dropMenu.hide();
  var selectedIndex = tablesList.selected;
  var tableName = tablesList.getItem(tablesList.selected).content;
  log.info("tablesList.selected:", tableName);
  // need to remove table and remove it from tablesList update 
  tablesList.focus();

  knex.schema.dropTableIfExists(tableName).then(function(){
    tables.splice(tables.indexOf(tableName), 1);
    tablesList.setItems(tables);
    //tablesList.removeItem(tableName, log);
    screen.render();
  });
});

dropMenu.cancel.on('press', function(){
  dropMenu.hide();
  tablesList.focus();
  screen.render();
});

dropMenu.hide();

// drop table
tablesList.key('d', function(event){
  dropMenu.focus();
  dropMenu.show();
  screen.render();
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

      queryResults.setText(utils.getTable(columns, resp.rows));
      
      screen.render();
      log.debug(rows);
    })
    .catch(function(err){
      log.error(err);
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
    log.debug(rows.length);
    rows.forEach(function(row){
      tables.push(row.table_name)
    });
    tablesList.setItems(tables);

    screen.render();
    tablesList.focus();
    log.debug(tablesList.ritems);
  })
  .catch(function(err){
    log.error(err);
    return process.exit(0);
  });

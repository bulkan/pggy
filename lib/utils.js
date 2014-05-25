var _ = require('lodash'),
    asciitable = require('asciitable'),
    queries = require('./queries');

module.exports = function(knex, log){

  var public = {};

  public.getTable = function getTable(columns, rows){
    var options = {
      intersectionCharacter: "*",
      skinny: true,
      columns: columns
    };

    return asciitable(options, rows);
  }

  public.getTableColumns = function getTableColumns(tableName){
    return knex(tableName)
      .select()
      .limit(1)
      .then(function(rows){
        if (rows.length === 0) {
          return [];
        }

        var cols =  _.keys(rows[0]);
        return cols;

      })
      .catch(function(err){
        log.error(err);
      });
  }

  public.getColumnTypes = function getColumnTypes(column){
    return knex
      .raw(queries.getColumnTypes(column))
      .then(function(resp){
        if (resp.rows.length === 0) {
          return;
        }
        var rows = resp.rows;

        return resp.rows;
      })
      .catch(function(err){
        log.error(err);
      });
  }

  return public;

}

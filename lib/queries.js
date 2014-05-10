var util = require('util');

var columnTypes = 'select attname AS column, format_type(atttypid, atttypmod) AS type '
                 + 'FROM   pg_attribute '
                 + "WHERE  attrelid = '%s'::regclass "
                 + 'AND    NOT attisdropped '
                 + 'AND    attnum > 0 '
                 + 'ORDER  BY attnum ';



module.exports = {
  getColumnTypes: function(column){
    return util.format(columnTypes, column);
  }
}

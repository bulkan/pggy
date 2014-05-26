module.exports = function(searchBox, log){

  var blessed = require('blessed');

  var tablesList = blessed.list({
    width: '30%',
    height: '95%',
    label: "{center}tables{/center}",
    tags: true,
    scrollable: true,
    mouse: true,
    border: {
      type: 'line'
    },
    padding: {
      left: 1,
      bottom: 2
    },
    keys: true,
    vi: true,
    style: {
      bg: 'black',
      fg: '#cccccc',
      border: {
        fg: '#ffffff'
      },
      hover: {
        bg: 'green'
      },
      selected: {
        fg: "gray",
        bg: "black",
        inverse: true
      }
    },
    search: function(cb){
      log.debug('search');
      searchBox.focus();
      searchBox.show();

      screen.render();

      searchBox.once('submit', function(searchString){
        log.debug(searchString);
        searchBox.hide();
        tablesList.focus();
        screen.render();
        return cb(searchString)
      })
    }
  });

  return tablesList;
}

module.exports = function(){
  var blessed = require('blessed');

  var tableInfo = blessed.list({
    width: '30%',
    height: '10%',
    left: '30%',
    top: '0%',
    label: "{center}columns{/center}",
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
    }
  });

  return tableInfo;
}

module.exports = function(log, screen){
  var blessed = require('blessed');

  var dropMenu = blessed.form({
    content: 'Drop database ?',
    parent: screen,
    name: 'drop',
    top: '50%',
    left: '50%',
    keys: true,
    shrink: true,
    width: 30,
    height: 4,
    border: {
      type: 'line',
      fg: 'blue'
    },
    style: {
      bg: 'blue',
      focus: {
        bg: 'red'
      },
      hover: {
        bg: 'red'
      }
    }
  });

  dropMenu.cancel = blessed.button({
    name: 'cancel',
    content: 'cancel',
    left: 20,
    top: 2,
    style: {
      bg: 'blue',
      focus: {
        bg: 'red'
      },
      hover: {
        bg: 'red'
      }
    },
    shrink: true,
    parent: dropMenu
  });

  dropMenu.submit = blessed.button({
    name: 'yes',
    content: 'yes',
    shrink: true,
    style: {
      bg: 'blue',
      focus: {
        bg: 'red'
      },
      hover: {
        bg: 'red'
      }
    },
    left: 10,
    top: 2,
    parent: dropMenu
  });

  return dropMenu;
}

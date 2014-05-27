module.exports = function(log, screen, submitCallback){
  var blessed = require('blessed');

  var dropMenu = blessed.form({
    content: 'Drop database ?',
    parent: screen,
    name: 'drop',
    top: '50%',
    left: '50%',
    keys: true,
    shrink: true,
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

  var cancel = blessed.button({
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

  var submit = blessed.button({
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

  submit.on('press', submitCallback);
    
  return dropMenu;
}

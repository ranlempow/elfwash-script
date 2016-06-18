define(['jquery', 'power-assert'], 
function ($, assert) { 
	function logging(level, tag, message, time) {
    function padChar(string, length, char) {
      char = char || '0';
      string = string.toString();
      var zeros = length - string.length
      while (zeros > 0) {
        string = char  + string;
        zeros--;
      }
      return string;
    }
    function formatDate(date, datePart, timePart, millisecondsPart) {
      var dateString = '';
      if (datePart) dateString += date.getFullYear() + '-' + padChar(date.getMonth() + 1, 2) + '-' + padChar(date.getDate(), 2);
      if (datePart && timePart) dateString += ' ';
      if (timePart) dateString += padChar(date.getHours(), 2) + ":" + padChar(date.getMinutes(), 2) + ":" +padChar(date.getSeconds(), 2);
      if (timePart && millisecondsPart) dateString += ":" + padChar(date.getMilliseconds(), 4);
      return dateString;
    }

    // level
    if (level in logging.level) {
      level = logging.level[level];
    }
    var level_string = Object.keys(logging.level).filter(function(key) {
      return logging.level[key] == level;
    })[0];
    assert(logging.levels.indexOf(level) != -1);

    // message
    if (message instanceof Error) {
      message = message.message;
    } /*else if(message instanceof Object) {
      message = syntaxHighlightJson(message);
    }*/ else if(! (typeof message === "string")) {
      message = message.toString();
    }
    assert(typeof message === "string");

    // time
    if (Number.isInteger(time) && time > 0) time = new Date(time);
    if (!time) time = new Date(0);
    assert(time instanceof Date);

    var s_timestamp = '[' + formatDate(new Date(), false, true, true) + ']';;
    var s_time = '[' + formatDate(time, true, true, false) + ']';
    var s_level = '[' + padChar(level_string, 5, ' ') + ']';
    if (logging.$el && logging.$el.length) {
	    logging.$el.append(
	      $('<span class="record">').addClass(level_string).addClass(tag.split('.').join(' ')).append(
	        $('<span class="timestamp">').text(s_timestamp),
	        $('<span class="time">').text(s_time),
	        $('<span class="level">').text(s_level),
	        $('<span class="tag">').text(tag + ':'),
	        $('<span class="message">').html(message)
	      )
	    );
	    logging.$el[0].scrollTop = logging.$el[0].scrollHeight;
	  } else {
	  	console.log(s_timestamp + s_time + s_level + tag + ': ' + message);
	  }
  }

  logging.level = {};
  logging.level.trace = 0;
  logging.level.debug = 10;
  logging.level.info = 30;
  logging.level.warn = 40;
  logging.level.error = 50;
  logging.level.fatal = 60;
  function hack_logger(logger) {
  	if (!logger.level) logger.level = {};
  	logger.levels = [];
		for (var k in logging.level) {
			logger.level[k] = logging.level[k];
			logger[k.toUpperCase()] = logging.level[k];
	    logger.levels.push(logging.level[k]);
		}
  }

  for (var k in logging.level) {
    logging[k] = (function(level) {
      return function(tag, message, time) {
        logging(level, tag, message, time);
      }
    })(logging.level[k]);
  }
  hack_logger(logging);
  

  logging.getLogger = function(tag) {
  	var logger = function(level, message, time) {
      logging(level, tag, message, time);
    }
    for (var k in logging.level) {
    	logger[k] = (function(level) {
  			return function(message, time) {
	        logging(level, tag, message, time);
	      }
	    })(logging.level[k]);
  	}
  	hack_logger(logger);
    return logger;
  }
  //logging.$el = $('#event-logging pre')
  
  return logging;
});

/**
 * module dependencies
 */

var define = Object.defineProperty
  , NULL = '\0'
  , RNULL = /\u0000$/

/**
 * converts a string to regular expression
 * and allows retrieval of defined variables
 * when parsing
 *
 * @api public
 * @param {String} str
 */

module.exports = sregex
function sregex (str) {
	var original, parts, compiled, defining, vars, currentVar, regex
	
	vars = [];
	
	if (str instanceof RegExp) {
		regex = str;
	} else {
		original = str;
		defining = false;
		compiled = '';
		currentVar = '';
		parts = str.split('');
		parts.push(NULL)

		parts.map(function (part, i) {
			
			// detect if a variable is being defined
			if (':' === part) {
				defining = true
			}
			// detect if defining a variable and 
			// the variable identifier is not 
			// being used as a sequential part
			// or a whitespace is detected
			else if (defining && ':' !== part && /[a-zA-Z]+/.test(part)) {
				currentVar += part;
			} 
			// if were defining a variable and
			// we've reached white space then
			// we can assume the definition
			// is complete
			else if (defining && !/[a-zA-Z]+/.test(part)) {
				// set defining `boolean` to false
				defining = false;
				// push to `vars` stack
				vars.push(currentVar);
				// convert to regex
				currentVar = '([a-zA-Z0-9|,|\.|\'|"|_|-|\=|\+]+)';

				if ('?' === part) currentVar += '?';
				else if (' ' === part) currentVar += '\\s?';
				else if ('\\' === part) currentVar += '\\';
				else if ('/' === part) currentVar += '\\/';
				else if ('|' === part) currentVar += '\\|';

				// append to compiled buffer
				compiled += currentVar;
				// reset `currentVar` to an empty string
				currentVar = '';
			}
			// we can assume the following parts
			// are part of a regular string and
			// should just be appended to the
			// compiled string
			else {
				// finish defining variable
				defining = false;

				// check if part needs to
				// be escaped
				if (' ' === part) {
					part = '\\s?';
				} else if ('/' === part) {
					part = '\\/';
				} else if ('|' === part) {
					part = '\\|';
				}

				// append part to compiled buffer
				compiled += part;
			}
		});

		regex = RegExp(compiled);
	}


	regex.vars = vars;

	define(regex, '_parts', {
		enumerable: false,
		get: function () { return parts; }
	});

	define(regex, '_compiled', {
		enumerable: false,
		get: function () { return compiled; }
	});

	// we need to preserve original functionality
	// and append `\0` to string for proper testing
	;['test', 'exec'].map(function (method) {
		 regex[method] = function (str) {
	    // append `\0` character for proper testing
	    str += NULL;
	    return (/:?/)[method].call(regex, str);
	  };
	});

	regex.parse = function (str) {
		var values, matches

		// add `\0` for proper string matching
		str += NULL
		matches = str.match(this);
		values = {};

		if (null === matches) return values;
		else values._match = matches.shift().replace(RNULL, '');

		// map all matches as indexex
		// to the `vars` object
		matches.map(function (match, i) {
			values[i] = match.replace(RNULL, '');
		});

		vars.map(function (v, i) {
			if (i > matches.length) return;
			values[v] = matches[i].replace(RNULL, '');
		});

		return values;
	};

	return regex
}

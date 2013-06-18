var sregex = require('./')
	,	assert = require('assert')

var values, regex, bytes, data, str, i

// standard string test
regex = sregex('my name is :name and [i|I] am :age?');
assert(regex);
assert(regex.vars);
assert('function' === typeof regex.parse);

values = regex.parse('my name is joe and I am 7');
assert(values);
assert(values.name === 'joe');
assert(values.age === '7');

// router tests
regex = sregex('/user/:id/?:action?');
assert(regex);
assert(regex.vars);
assert('function' === typeof regex.parse);

values = regex.parse('/user/1234/edit');
assert(values);
assert(values.id === '1234');
assert(values.action === 'edit');


regex = sregex('payload|:data')
bytes = [];
data = { id: 1234, date: Date.now() };
str = JSON.stringify(data)

for (i = 0; i < str.length; ++i) {
	bytes.push(str.charCodeAt(i));
}

values = regex.parse('payload|'+ bytes.toString());
assert(values.data);

var parsed = ''
values.data.split(',').map(function (part) {
	parsed += String.fromCharCode(part);
});

assert(parsed.length);
parsed = JSON.parse(parsed);
assert(parsed.id === data.id);
assert(parsed.date === data.date);

console.log();
console.log('   √ ok');
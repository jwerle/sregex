sregex
====

simple string regular expression that exposes matches in defined variables

## install

*node*

```js
$ npm install sregex
```

*component*

```js
$ component install jwerle/sregex
```

*bower*

```js
bower install sregex
```


## usage

using `sregex` is as simple as passing it a string

```js

var regex = sregex('some string')

regex.test('some string'); // true
regex.test('some other string'); // false
```

the returned `regex` object from `sregex` is an instance of `RegExp` with a `parse()` function attached to it

```js

regex.parse('some string'); // {}
```

you can easily define variables within your string `sregex` string and access them from a string with the `parse` function

```js
var regex = sregex('my name is :name and i am :age');
var values = regex.parse('my name is joe and i am 22');

console.log(values.name); // joe
console.log(values.age); // 22
```

the `str` argument for `sregex` accepts a string, but it also can have valid regular expression interpolated

```js
var regex = sregex('it can accept multiple regular expressions like ([a-zA-Z]+), ([0-9]+), and ([a-z]+)');

var values = regex.parse('it can accept multiple regular expressions like foogots, 45, and apple');

console.log(values[0]); // foogots
console.log(values[1]); // 45
console.log(values[2]); // apple
```

### building a regular expression router

building a router that parses url parameters can be simple as well

```js
var http = require('http')
	,	sregex = require('sregex')

http.createServer(function (req, res) {
	var regex = sregex('/:resource/:id/:action')

	// in the browser head to `http://localhost:4000/videos/1234/edit`
	console.log(regex.parse(req.url)); // { resource: 'videos', id: '1234', action: 'edit' }
}).listen(4000);
```

## api

### sregex(str)

converts a string to regular expression and allows retrieval of defined variables when parsing

* `str` - a string to convert to regular expression

***example***

```js
var regex = sregex('/user/:id')
```

### .parse(str)

parses a given string and returns an object representing the values extracted using the regular expression used to create it

* `str` - a string to parse and extact values from based on regular expression matches

***example***

```js
var regex = sregex('/account/:action')
var values = regex.parse('/action/edit');

console.log(values.action); // edit
```

## example 

we can convert a `object` to a `JSON` string and then to binary and attach it to the string

```js
var regex = sregex('payload|:data')

var bytes = [];

var data = {
	id: 1234,
	date: Date.now()
};

var str = JSON.stringify(data)

for (var i = 0; i < str.length; ++i) {
	bytes.push(str.charCodeAt(i));
}

var values = regex.parse('payload|'+ bytes.toString());

console.log(values.data); // '123,34,105,100,34,58,49,50,51,52,44,34,100,97,116,101,34,58,49,51,55,49,53,56,51,52,51,53,52,52,48,125'

// parse it back into a JSON string

var parsed = ''
values.data.split(',').map(function (part) {
	parsed += String.fromCharCode(part);
});

console.log(parsed); // {"id":1234,"date":1371583641484}
console.log(JSON.parse(parsed)); // { id: 1234, date: 1371583754259 }
```

## license

MIT
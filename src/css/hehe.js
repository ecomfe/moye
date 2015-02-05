var fs = require('fs');
var file = './v.less';
var text = fs.readFileSync(file, 'utf8');

text = text.replace(/@([\w]+)/g, function (all, $1) {
    var result = [];
    var current = '';
    for (var i = 0, len = $1.length; i < len; i++) {
        var char = $1.charAt(i);
        if (char >= 'A' && char <= 'Z') {
            result.push(current.toLowerCase());
            current = char;
        }
        else {
            current += char;
        }
    }
    if (current) {
        result.push(current.toLowerCase());
    }
    console.dir(result);
    return '@moye-' + result.join('-');
});

// text = text.replace(/@([a-z]+)(-[a-z]+)*/g, function (all, $1, $2) {
//     return '@' + ($1 === 'moye' ? $1 : 'moye-' + $1) + ($2 || '');
// });

console.log(text);

fs.writeFileSync(file, text, 'utf8');


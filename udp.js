module.exports = function (host, port, payload, payloadType, callback) {
    var dgram = require('dgram');

    var payloadText = '';

    if (payloadType === 'json' && typeof payload === 'object') {
        payloadText = payload.toString();
        payloadType = 'utf8';

    } else if (payloadType ===  'text_list' && typeof payload === 'array') {
        for (let line of payload) {
            payloadText += line;
            payloadText += '\n';
        }
        payloadText = payloadText.slice(0, -1);
        payloadType = 'utf8';

    } else {
        payloadText = payload;
        if (payloadType === 'text') {
            payloadType = 'utf8';
        }
    }

    var message = new Buffer(payloadText, payloadType);

    var client = dgram.createSocket('udp4');
    var delayTime = Math.floor(Math.random() * 1500) + 1;
    setTimeout(function() {
        client.send(message, 0, message.length, port, host, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + host +':'+ port);
            client.close();

            callback(err);
        });

    }, delayTime);
}

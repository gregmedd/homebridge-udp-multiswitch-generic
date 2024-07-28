'use strict';

var Service;
var Characteristic;
var udp = require('./udp');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-udp-switch', 'UdpSwitch', UdpSwitch);
};

function UdpSwitch(log, config) {
    this.log = log;

    this.name = config.name;
    this.switchType = config.switch_type;
    this.host = config.host;
    this.port = config.port;
    this.payloadType = config.payload_type || 'text';
    this.onPayload = config.on_payload;
    this.offPayload = config.off_payload;
}

UdpSwitch.prototype = {

    udpRequest: function(host, port, payload, callback) {
        udp(host, port, payload, function (err) {
            callback(err);
        });
    },

    setPowerState: function(targetService, powerState, callback, context) {
        var funcContext = 'fromSetPowerState';
        var payload;

        // Callback safety
        if (context == funcContext) {
            if (callback) {
                callback();
            }

            return;
        }

        if (!this.onPayload || !this.offPayload) {
            this.log.warn('Ignoring request; No power state payloads defined.');
            callback(new Error('No power state payloads defined.'));
            return;
        }

        payload = powerState ? this.onPayload : this.offPayload;

        this.udpRequest(this.host, this.port, payload, this.payloadType, function(error) {
            if (error) {
                this.log.error('setPowerState failed: ' + error.message);
                this.log('response: ' + response + '\nbody: ' + responseBody);

                callback(error);
            } else {
                this.log.info('==> ' + (powerState ? "On" : "Off"));
            }
            callback();
        }.bind(this));
    },

    identify: function (callback) {
        this.log('Identify request received for ' + this.name);
        callback();
    },

    getServices: function () {
        this.services = [];

        var informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, 'UDP-Switch')
            .setCharacteristic(Characteristic.Model, 'UDP-Switch');
        this.services.push(informationService);

        this.log('(switch) ' + this.name);

        var switchService = new Service.Switch(this.name);
        switchService
            .getCharacteristic(Characteristic.On)
            .on('set', this.setPowerState.bind(this, switchService));

        this.services.push(switchService);

        return this.services;
    }
};

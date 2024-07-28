# homebridge-udp-switch-generic

Simple UDP switches for Homebridge.

Allows for virtual on/off switches to be created in Homebridge that, when
activated, send UDP datagrams to a specified destination. The payload of the UDP
datagram can be defined in the configuration each state of the switch.

*Forked from [homebridge-udp-multiswitch][original-hb-udp], which appears to
have been abandoned.*

### Changes from `homebridge-udp-multiswitch`

1. A fixed "broadcast" payload is no longer sent out before the switch payload
2. The "Multiswitch" has been removed to simplify the code
3. Payloads are no longer *required* to be hex encoded in the plugin
   configuration

## Example Configuration

Represents a standard on/off switch. This could be used for things like lights,
TVs and projectors, fans, etc.

```
{
        "accessory": "UdpSwitch",
        "name": "My Projector",
        "host": "my-projector.local",
        "port": 5000,
        "on_payload": "power_on",
        "off_payload": "power_off"
}
```

## Configuration Parameters

|      Parameter     |                                  Description                                  | Required |
| ------------------ | ----------------------------------------------------------------------------- |:--------:|
| `name`             | Name of the accessory                                                         |     ✓    |
| `host`             | Network address to send UDP datagrams to. Can be a hostname or IPv4 address   |     ✓    |
| `port`             | UDP destination port where the target host is listening                       |     ✓    |
| `payload_encoding` | Sets how payload fields in the configuration are interpreted. See table below |          |
| `on_payload`       | Payload for the on state                                                      |     ✓    |
| `off_payload`      | payload for the off state                                                     |     ✓    |

### Payload Encodings

|    Value    |                                        Description                                        | Default |
| ----------- | ----------------------------------------------------------------------------------------- |:-------:|
| `text`      | THe payload field is literal text. It will be copied into the datagram as-is              |    ✓    |
| `hex`       | The payload is hexadecimal encoded binary. It will be decoded into the datagram           |         |
| `base64`    | The payload is base64 encoded binary. It will be decoded into the datagram                |         |
| `json`      | Any JSON structre within the payload field will be serialized into the datagram           |         |
| `text_list` | The payload is a JSON list of `text`. They will put in the datagram separated by newlines |         |

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install homebridge-udp-switch using: `npm install -g homebridge-udp-switch`
3. Update your config file

[homebridge-udp-multiswitch]: https://github.com/nitaybz/homebridge-udp-multiswitch

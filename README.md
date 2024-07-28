# homebridge-udp-multiswitch-generic

Simple UDP switches for Homebridge.

Allows for virtual switches to be created in Homebridge that, when activated,
send UDP packets to a specified destination. The payload of the UDP packet is
defined as a string, and sent exactly as specified.

Two switch types are supported: "Switch" (on/off) and "Multiswitch" (selectable
named states).

*Forked from [homebridge-udp-multiswitch][original-hb-udp]*

### Changes from `homebridge-udp-multiswitch`

The original `homebridge-udp-multiswitch` plugin appears to have been abandoned.
It contains several undocumented behaviors that did not work in my application,
such as sending a generic "broadcast" payload before the real payload requiring
all payloads to be hex encoded.

More supported payload encodings have been added, and the default is now plain
text. The initial "broadcast" payload is no longer sent.

I needed more control to send commands to a Brightsign player, so this fork was
created.

## Switch Services

### Switch (standard on/off)

Represents a standard on/off switch. This could be used for things like lights,
TVs and projectors, fans, etc.

```
{
        "accessory": "UdpMultiswitch",
        "switch_type": "Switch",
        "name": "My Projector",
        "host": "my-projector.local",
        "port": 5000,
        "on_payload": "power_on",
        "off_payload": "power_off"
}
```

### Multiswitch (selectable custom states)

Represents multi-state switchers, such as a TV with inputs or a dashboard with
multiple pages.

```
{
    "accessory": "UdpMultiswitch",
    "switch_type": "Multiswitch",
    "name": "Some Selector",
    "host": "192.168.0.100",
    "port": 80,
    "payload_encoding": "hex"
    "multiswitch": [
                { "name": "Left", "payload" : "536574204C656674" },
                { "name": "Middle", "payload" : "536574204D4944444C45" },
                { "name": "Right", "payload" : "526967687421" },
            ]
}
```

## Configuration Params

|      Parameter     |                                  Description                                  | Required |
| ------------------ | ----------------------------------------------------------------------------- |:--------:|
| `name`             | Name of the accessory                                                         |     ✓    |
| `switch_type`      | One of `Switch` or `Multiswitch`                                              |     ✓    |
| `host`             | Network address to send UDP datagrams to                                      |     ✓    |
| `port`             | UDP port to send datagrams to                                                 |     ✓    |
| `payload_encoding` | Sets how payload fields in the configuration are interpreted. See table below |          |

### Payload Encodings

|    Value    |                                        Description                                        | Default |
| ----------- | ----------------------------------------------------------------------------------------- |:-------:|
| `text`      | THe payload field is literal text. It will be copied into the datagram as-is              |    ✓    |
| `hex`       | The payload is hexadecimal encoded binary. It will be decoded into the datagram           |         |
| `base64`    | The payload is base64 encoded binary. It will be decoded into the datagram                |         |
| `json`      | Any JSON structre within the payload field will be serialized into the datagram           |         |
| `text_list` | The payload is a JSON list of `text`. They will put in the datagram separated by newlines |         |

### Switch Parameters

|    Parameter   |        Description        | Required |
| -------------- | ------------------------- |:--------:|
| `on_payload`   | Payload for the on state  |     ✓    |
| `off_payload`  | payload for the off state |     ✓    |

### Multiswitch Parameters

|   Parameter   |                               Description                              | Required |
| ------------- | ---------------------------------------------------------------------- |:--------:|
| `multiswitch` | List of Multiswitch state objects. Order is preserved. See table below |     ✓    |

#### Multiswitch State Parameters

|   Parameter   |                     Description                   | Required |
| ------------- | ------------------------------------------------- |:--------:|
| `name`        | Display name of the switch state.                 |     ✓    |
| `payload`     | Payload sent when entering this switch state.     |     ✓    |
| `off_payload` | If specified, sent when exiting this switch state |          |

*Note: `off_payload` for the previous state, if specified, will be sent before
`payload` for the new state is sent*

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install homebridge-http using: `npm install -g homebridge-udp-multiswitch-generic`
3. Update your config file

[homebridge-udp-multiswitch]: https://github.com/nitaybz/homebridge-udp-multiswitch

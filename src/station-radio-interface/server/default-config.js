export default {
  radios: [{
    channel: 1,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 2,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 3,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 4,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 5,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 6,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 7,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 8,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 9,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 10,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 11,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 12,
    config: [
      "preset:fsktag"
    ],
    record: true
  },{
    channel: 13,
    config: [],
    record: true
  },{
    channel: 14,
    config: [],
    record: true
  },{
    channel: 15,
    config: [],
    record: true
  },{
    channel: 16,
    config: [],
    record: true
  },
  {
    channel: 17,
    config: [],
    record: true
  },
  {
    channel: 18,
    config: [],
    record: true
  },
  {
    channel: 19,
    config: [],
    record: true
  },
  {
    channel: 20,
    config: [],
    record: true
  },
  {
    channel: 21,
    config: [],
    record: true
  },
  {
    channel: 22,
    config: [],
    record: true
  },
  {
    channel: 23,
    config: [],
    record: true
  },
  {
    channel: 24,
    config: [],
    record: true
  },
  {
    channel: 25,
    config: [],
    record: true
  },
  {
    channel: 26,
    config: [],
    record: true
  },
  {
    channel: 27,
    config: [],
    record: true
  },
  {
    channel: 28,
    config: [],
    record: true
  },
  {
    channel: 29,
    config: [],
    record: true
  },
  {
    channel: 30,
    config: [],
    record: true
  },
  {
    channel: 31,
    config: [],
    record: true
  },
  {
    channel: 32,
    config: [],
    record: true
  },
  {
    channel: 33,
    config: [],
    record: true
  },
  {
    channel: 34,
    config: [],
    record: true
  },
  {
    channel: 35,
    config: [],
    record: true
  },
  {
    channel: 36,
    config: [],
    record: true
  }],
  http: {
    websocket_port: 8001,
    flush_websocket_messages_seconds: 1
  },
  record: {
    enabled: true,
    alive_frequency_seconds: 60*10,
    date_format: "YYYY-MM-DD HH:mm:ss",
    flush_data_cache_seconds: 5,
    checkin_frequency_minutes: 60*6,
    sensor_data_frequency_minutes: 60,
    rotation_frequency_minutes: 60,
    base_log_directory: "/data",
    mobile: false
  },
	upload: {
		ctt: true,
		sensorgnome: true
	},
  led: {
    toggle_frequency_seconds: 1
  },
  gps: {
    enabled: true,
    record: true,
    seconds_between_fixes: 60*15
  }
}

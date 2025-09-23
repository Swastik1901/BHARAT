var APP_DATA = {
  "scenes": [
    {
      "id": "0-1st",
      "name": "1st",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": -1.1386725793823587,
        "pitch": -0.1063335868411901,
        "fov": 1.489667856106396
      },
      "linkHotspots": [
        {
          "yaw": 0.03827496558171006,
          "pitch": 0.07052693171295132,
          "rotation": 0,
          "target": "1-2nd"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -1.9238786129940113,
          "pitch": -0.005326750919842027,
          "title": "The Garden of Shaheed Minar",
          "text": "The Garden of Shaheed Minar is a green public space surrounding the historic Shaheed Minar in Kolkata. It serves as a peaceful spot for relaxation and also as a venue for cultural gatherings, meetings, and public events."
        }
      ]
    },
    {
      "id": "1-2nd",
      "name": "2nd",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.43572194188923064,
          "pitch": 0.11544113501254394,
          "rotation": 5.497787143782138,
          "target": "2-left"
        },
        {
          "yaw": 0.445525952493389,
          "pitch": 0.13780909689256404,
          "rotation": 0.7853981633974483,
          "target": "3-right"
        },
        {
          "yaw": -3.118549115048115,
          "pitch": 0.07400510172229602,
          "rotation": 0,
          "target": "0-1st"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.10231115869639851,
          "pitch": -0.1579425663490639,
          "title": "The Shaheed Minar pillar<div><br></div>",
          "text": "The Shaheed Minar pillar in Kolkata is a tall, elegant structure originally built in 1828 and later dedicated to India’s martyrs. It features classical architectural design and stands as a prominent symbol of remembrance in the city."
        }
      ]
    },
    {
      "id": "2-left",
      "name": "Left",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 1.3083576385682054,
          "pitch": 0.10994099127303514,
          "rotation": 11.780972450961727,
          "target": "1-2nd"
        },
        {
          "yaw": -0.8500575887954938,
          "pitch": 0.10025876988473215,
          "rotation": 0.7853981633974483,
          "target": "3-right"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.2736802002028931,
          "pitch": -0.21974749375729274,
          "title": "The small door of Shaheed Minar",
          "text": "The small door of Shaheed Minar provides access to the interior of the monument, allowing visitors to view its structure up close. It is a modest entrance that complements the tall, elegant pillar without altering its monumental appearance."
        }
      ]
    },
    {
      "id": "3-right",
      "name": "Right",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.492889920292523,
          "pitch": 0.06404588607502859,
          "rotation": 7.0685834705770345,
          "target": "2-left"
        },
        {
          "yaw": -0.3598546718368656,
          "pitch": 0.10146073008192857,
          "rotation": 5.497787143782138,
          "target": "1-2nd"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};

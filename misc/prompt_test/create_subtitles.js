const fs = require("fs");
const utils = require("./utils");

// Load video content
// Format:
// [
//     {
//       "created_at": "2023-07-05T21:54:02.913847+00:00",
//       "data": " Okay, so hello everyone. Today is the last lecture of the series of lecture on component",
//       "room_id": "139909",
//       "id": "4746342d-2541-4199-821d-56d28dd02712",
//       "page": null,
//       "video_start_ms": 0,
//       "video_end_ms": 9.68
//     },
//     {
//       "created_at": "2023-07-05T21:54:02.913847+00:00",
//       "data": " analysis. So we've seen CCA, ICA, and today we look at some more general, which is representation",
//       "room_id": "139909",
//       "id": "b39f3958-d94f-4f71-9641-862ea141d9a8",
//       "page": null,
//       "video_start_ms": 9.68,
//       "video_end_ms": 19.64
//     },
//     ..
// ]
const videoContentLong = require("./raw/example_video_long_repr_learning.json");
let videoContentShort = require("./raw/example_video_short_cnn.json");
videoContentShort = videoContentShort.map((segment) => {
  return {
    data: segment.text,
    video_start_ms: segment.video_start_ms,
    video_end_ms: segment.video_end_ms,
  };
});

segments = utils.cleanText(videoContentLong);
converted_text = utils.segments_to_string(segments);
fs.writeFileSync("./output/long_example_video_subformat.txt", converted_text);

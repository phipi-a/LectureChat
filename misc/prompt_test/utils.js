function convert_seconds_to_min_sec(seconds) {
  const minutes = Math.floor(seconds / 60);
  const seconds_remainder = Math.floor(seconds % 60);
  return `${minutes}:${seconds_remainder < 10 ? "0" : ""}${seconds_remainder}`;
}

function convert_min_sec_to_seconds(min_sec) {
  const [min, sec] = min_sec.split(":");
  return parseInt(min) * 60 + parseInt(sec);
}

// Connects
function cleanText(videoContent) {
  segments = [];

  let i = 0;
  while (i < videoContent.length) {
    const segment = videoContent[i];
    const nextSegment = videoContent[i + 1];

    if (segment.data.endsWith(".") || !nextSegment) {
      // If the segment ends with a period, we can just add it to the list
      segments.push({
        data: segment.data.trim(),
        time: convert_seconds_to_min_sec(segment.video_start_ms),
        timeSec: Math.floor(segment.video_start_ms),
      });
      i++;
    } else {
      // If the segment doesn't end with a period, we need to add the next segment
      idx = nextSegment.data.indexOf(".");

      if (idx == -1) {
        segment.data = segment.data + nextSegment.data;
        videoContent.splice(i + 1, 1);
      } else {
        firstSentence = nextSegment.data.substring(0, idx + 1);
        rest = nextSegment.data.substring(idx + 1);

        segments.push({
          data: (segment.data + firstSentence).trim(),
          time: convert_seconds_to_min_sec(segment.video_start_ms),
          timeSec: Math.floor(segment.video_start_ms),
        });

        nextSegment.data = rest;
        i++;
      }
    }
  }

  return segments;
}

function segments_to_string(segments) {
  return segments.reduce((acc, curr) => {
    if (curr.data.trim() == "") {
      return acc;
    }

    return `${acc}[${curr.time}]\n${curr.data}\n\n`;
  }, "");
}

module.exports = {
  cleanText,
  segments_to_string,
  convert_min_sec_to_seconds,
  convert_seconds_to_min_sec,
};

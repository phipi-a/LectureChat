import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export function CircularRating({
  value,
  helpText,
}: {
  value: null | number;
  helpText?: string;
}) {
  //collor red to green linear to value

  const color = (value: number | null) => {
    if (value === null) {
      return "text.disabled";
    }
    let r =
      value < 50 ? 255 : Math.floor(255 - ((value * 2 - 100) * 255) / 100);
    let g = value > 50 ? 255 : Math.floor((value * 2 * 255) / 100);
    r = r * 0.5;
    g = g * 0.5;

    return `rgb(${r}, ${g}, 0)`;
  };
  return (
    <Box display={"flex"} flexDirection={"row"} sx={{ m: 1 }}>
      <Tooltip title={helpText}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={value === 0 ? 1 : value === null ? 100 : value}
            sx={{
              color: color(value),
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >
              {value !== null ? `${Math.round(value)}%` : "-"}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
}

import { BulletPointI } from "@/common/Interfaces/Interfaces";
import { SendOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

export function BulletPoint({
  onOpenChat,
  bulletPoint,
  setPlayPosition,
  setCurrentPage,
  bulletPointId,
}: {
  onOpenChat: (a: BulletPointI, bulletPointId: number) => void;
  bulletPoint: BulletPointI;
  setPlayPosition: ({ pos }: { pos: number }) => void;
  setCurrentPage: (page: number) => void;
  bulletPointId: number;
}) {
  return (
    <div>
      <Box display={"flex"} alignItems={"center"}>
        <h3
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (bulletPoint.video_start_ms !== undefined) {
              setPlayPosition({ pos: bulletPoint.video_start_ms });
            } else if (bulletPoint.page !== undefined) {
              setCurrentPage(parseInt(bulletPoint.page));
            }
          }}
        >
          {bulletPoint.bullet_point}
        </h3>
        <IconButton
          sx={{
            mx: 1,
          }}
          onClick={() => {
            onOpenChat(bulletPoint, bulletPointId);
          }}
        >
          <SendOutlined />
        </IconButton>
      </Box>
      <div>{bulletPoint.longer_explanation}</div>
    </div>
  );
}

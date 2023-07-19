import { BulletPointI } from "@/common/Interfaces/Interfaces";
import { time2sec } from "@/utils/helper";
import { SendOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

export function BulletPoint({
  onOpenChat,
  bulletPoint,
  setPlayPosition,
  setCurrentPage,
  bulletPointId,
  isFirst,
}: {
  onOpenChat: (a: BulletPointI, bulletPointId: number) => void;
  bulletPoint: BulletPointI;
  setPlayPosition: ({ pos }: { pos: number }) => void;
  setCurrentPage: (page: number) => void;
  bulletPointId: number;
  isFirst: boolean;
}) {
  console.log(isFirst);
  return (
    <div>
      <Box display={"flex"} alignItems={"center"}>
        <h3
          style={{ cursor: "pointer" }}
          className={isFirst ? "jumptopositionbulletpoint" : ""}
          onClick={() => {
            if (bulletPoint.start !== undefined) {
              // mm:ss to ms
              bulletPoint.start.split(":")[0];
              setPlayPosition({
                pos: time2sec(bulletPoint.start),
              });
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
          className={isFirst ? "showchatbutton" : ""}
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

export interface BulletPointI {
  bullet_point: string;
  longer_explanation: string;
  page: string | undefined;
  id: number;
  video_start_ms: number | undefined;
  video_end_ms: number | undefined;
}

export function BulletPoint({
  bulletPoint,
  setPlayPosition,
  setCurrentPage,
}: {
  bulletPoint: BulletPointI;
  setPlayPosition: ({ pos }: { pos: number }) => void;
  setCurrentPage: (page: number) => void;
}) {
  return (
    <div>
      <h3
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (bulletPoint.video_start_ms) {
            setPlayPosition({ pos: bulletPoint.video_start_ms });
          } else if (bulletPoint.page) {
            setCurrentPage(parseInt(bulletPoint.page));
          }
        }}
      >
        {bulletPoint.bullet_point}
      </h3>
      <div>{bulletPoint.longer_explanation}</div>
    </div>
  );
}

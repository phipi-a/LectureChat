import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import { useGetData } from "@/utils/supabase/supabaseData";
import { Button, CircularProgress } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

interface BulletPoint {
  bullet_point: string;
  page: string | undefined;
  video_start_ms: number | undefined;
  video_end_ms: number | undefined;
}

export function BulletPoints({ roomId }: { roomId: string }) {
  const { segments, setCurrentPage, setPlayPosition } = useContext(RoomContext);
  const queryClient = useQueryClient();
  const { userData } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Creating new bullet points");

      return supabase.functions.invoke("bulletpoints", {
        body: {
          roomId,
          openaiKey: userData?.openai_key,
        },
      });
    },
    onSuccess: (res) => {
      if (!res) return;
      setBulletPoints(res.data.data);
    },
  });

  // Read bulletpoints from db
  const bulletPointsData = useGetData(
    ["bulletpoints", roomId],
    supabase.from("bulletpoints").select("*").eq("room_id", roomId).single(),
    {
      onSuccess: (data) => {
        console.log("BulletPoints: onSuccess", data);
        // If no bullet points are found
        if (data?.error) {
          // Create new bullet points
          if (mutation.isLoading) return;
          mutation.mutate();
        }
      },
    }
  );
  const [bulletPoints, setBulletPoints] = React.useState<BulletPoint[] | null>(
    bulletPointsData.data?.error === null
      ? JSON.parse(bulletPointsData!.data!.data!.bulletpoints! as string)
      : null
  );

  // If segments change, check if the last segment is on a new page
  const prevSegmentLength = React.useRef(segments.length || 0);
  useEffect(() => {
    if (prevSegmentLength.current === 0 && segments.length) {
      prevSegmentLength.current = segments.length;
      return;
    }

    if (segments.length > prevSegmentLength.current) {
      const lastSegment = segments[segments.length - 1];
      const secondLastSegment = segments[segments.length - 2];

      if (lastSegment.page !== secondLastSegment.page) {
        console.log("BulletPoints: page changed", lastSegment.page);
        mutation.mutate();
        prevSegmentLength.current = segments.length;
      }
    }
  }, [segments.length]);

  const loading = bulletPointsData.isLoading || mutation.isLoading;

  const json = segments.map((row) => ({
    text: row.data,
    video_start_ms: row.video_start_ms,
    video_end_ms: row.video_end_ms,
  }));
  console.log("json", bulletPoints);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "end" }}>
        <Button
          variant="outlined"
          onClick={() => {
            mutation.mutate();
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              Updating
              <CircularProgress
                style={{ width: "16px", height: "16px", margin: "4px" }}
              />
            </>
          ) : (
            <>Update</>
          )}
        </Button>
      </div>
      <ul>
        {bulletPoints!.map((bulletPoint: BulletPoint) => (
          <li
            key={
              bulletPoint.bullet_point +
              bulletPoint.video_start_ms +
              bulletPoint.page
            }
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (typeof bulletPoint.video_start_ms === "number") {
                setPlayPosition({ pos: bulletPoint.video_start_ms! });
              } else if (typeof bulletPoint.page === "string") {
                setCurrentPage(parseInt(bulletPoint.page!));
              }
            }}
          >
            {bulletPoint.bullet_point}
          </li>
        ))}
      </ul>
    </div>
  );
}

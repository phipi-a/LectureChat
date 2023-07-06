import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import { useGetData } from "@/utils/supabase/supabaseData";
import { LoadingButton } from "@mui/lab";
import React, { useContext, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

import { BulletPoint, BulletPointI } from "./BulletPoint";

export function BulletPoints({
  roomId,
  onOpenChat,
}: {
  roomId: string;
  onOpenChat: (a: string) => void;
}) {
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

      if (res.data) {
        setBulletPoints(res.data.data);
      }
    },
  });

  // Read bulletpoints from db
  const bulletPointsData = useGetData(
    ["bulletpoints", roomId],
    supabase.from("bulletpoints").select("*").eq("room_id", roomId).single(),
    {
      onSuccess: (data) => {
        // If no bullet points are found
        if (data?.error) {
          // Create new bullet points
          if (mutation.isLoading) return;
          mutation.mutate();
        }
      },
    }
  );

  const [bulletPoints, setBulletPoints] = React.useState<BulletPointI[] | null>(
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

  return (
    <div>
      <div style={{ display: "flex", alignItems: "end" }}>
        <LoadingButton
          variant="outlined"
          onClick={() => mutation.mutate()}
          disabled={loading}
        >
          {loading ? "Updating" : "Update"}
        </LoadingButton>
      </div>
      {bulletPoints &&
        bulletPoints.map((bulletPoint: BulletPointI) => (
          <BulletPoint
            key={
              bulletPoint.bullet_point +
              bulletPoint.video_start_ms +
              bulletPoint.page
            }
            bulletPoint={bulletPoint}
            setPlayPosition={setPlayPosition}
            setCurrentPage={setCurrentPage}
          />
        ))}
    </div>
  );
}

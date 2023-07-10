import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import { useGetData } from "@/utils/supabase/supabaseData";
import { LoadingButton } from "@mui/lab";
import React, { useContext, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

import { BulletPointI } from "@/common/Interfaces/Interfaces";
import { BulletPoint } from "./BulletPoint";

export function convert_min_sec_to_seconds(min_sec: string) {
  const [min, sec] = min_sec.split(":");
  return parseInt(min) * 60 + parseInt(sec);
}
interface BulletpointSection {
  title: string;
  start: string;
  end: string;
  bullet_points: BulletPointI[];
}

interface VideoBulletPoints {
  isLong: boolean;
  sections: BulletpointSection[] | undefined;
  bullet_points: BulletPointI[] | undefined;
}

function BulletPointList({
  bulletPoints,
  bulletPointsId,
  setPlayPosition,
  setCurrentPage,
  onOpenChat,
}: {
  bulletPoints: BulletPointI[];
  bulletPointsId: number;
  setPlayPosition: ({ pos }: { pos: number }) => void;
  setCurrentPage: (page: number) => void;
  onOpenChat: (a: BulletPointI, bulletPointId: number) => void;
}) {
  return (
    <>
      {bulletPoints &&
        bulletPoints.map((bulletPoint: BulletPointI) => (
          <BulletPoint
            key={
              bulletPoint.bullet_point + bulletPoint.start + bulletPoint.page
            }
            bulletPointId={bulletPointsId}
            bulletPoint={bulletPoint}
            setPlayPosition={setPlayPosition}
            setCurrentPage={setCurrentPage}
            onOpenChat={onOpenChat}
          />
        ))}
    </>
  );
}

function VideoBulletPoints({
  bulletPoints,
  bulletPointsId,

  setPlayPosition,
  setCurrentPage,
  onOpenChat,
}: {
  bulletPoints: VideoBulletPoints;
  bulletPointsId: number;
  setPlayPosition: ({ pos }: { pos: number }) => void;
  setCurrentPage: (page: number) => void;
  onOpenChat: (a: BulletPointI, bulletPointId: number) => void;
}) {
  if (!bulletPoints.isLong) {
    return (
      <BulletPointList
        bulletPointsId={bulletPointsId}
        bulletPoints={bulletPoints.bullet_points!}
        setPlayPosition={setPlayPosition}
        setCurrentPage={setCurrentPage}
        onOpenChat={onOpenChat}
      />
    );
  }

  return (
    <div>
      {bulletPoints.sections?.map((section, i) => (
        <div key={i}>
          <h2
            style={{ cursor: "pointer" }}
            onClick={() =>
              setPlayPosition({
                pos: convert_min_sec_to_seconds(section.start),
              })
            }
          >
            {section.title} ({section.start} - {section.end})
          </h2>
          <BulletPointList
            bulletPoints={section.bullet_points}
            setPlayPosition={setPlayPosition}
            setCurrentPage={setCurrentPage}
            onOpenChat={onOpenChat}
            bulletPointsId={bulletPointsId}
          />
        </div>
      ))}
    </div>
  );
}

export function BulletPoints({
  roomId,
  onOpenChat,
}: {
  roomId: string;
  onOpenChat: (a: BulletPointI, bulletPointId: number) => void;
}) {
  const { segments, setCurrentPage, setPlayPosition } = useContext(RoomContext);
  const queryClient = useQueryClient();
  const { userData } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: async () => {
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
        queryClient.invalidateQueries(["bulletpoints", roomId]);
      }
    },
  });

  // Read bulletpoints from db
  const bulletPointsData = useGetData(
    ["bulletpoints", roomId],
    supabase
      .from("bulletpoints")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", userData?.id)
      .single(),
    {
      onSuccess: (data) => {
        // If no bullet points are found
        if (data?.error) {
          // Create new bullet points
          if (mutation.isLoading) return;
          queryClient.setQueryData(["bulletpoints", roomId], []);
          console.log("Creating new bullet points mut");
          mutation.mutate();
        }
      },
    }
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
        mutation.mutate();
        console.log("New page detected");
        prevSegmentLength.current = segments.length;
      }
    }
  }, [segments.length]);

  const bulletPoints = bulletPointsData.data?.data?.bulletpoints
    ? JSON.parse(bulletPointsData.data?.data?.bulletpoints as string)
    : [];
  console.log(bulletPoints);

  const loading = bulletPointsData.isLoading || mutation.isLoading;
  const isVideo = bulletPoints && "isLong" in bulletPoints;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "end" }}>
        <LoadingButton
          variant="outlined"
          onClick={() => {
            mutation.mutate();
            console.log("Creating new bullet pointsclick");
          }}
          disabled={loading}
        >
          {loading ? "Updating" : "Update"}
        </LoadingButton>
      </div>
      {bulletPoints && (
        <>
          {isVideo ? (
            <VideoBulletPoints
              bulletPoints={bulletPoints as unknown as VideoBulletPoints}
              setPlayPosition={setPlayPosition}
              setCurrentPage={setCurrentPage}
              onOpenChat={onOpenChat}
              bulletPointsId={bulletPointsData.data?.data?.id!}
            />
          ) : (
            <BulletPointList
              bulletPoints={bulletPoints as unknown as BulletPointI[]}
              setPlayPosition={setPlayPosition}
              setCurrentPage={setCurrentPage}
              onOpenChat={onOpenChat}
              bulletPointsId={bulletPointsData.data?.data?.id!}
            />
          )}
        </>
      )}
    </div>
  );
}

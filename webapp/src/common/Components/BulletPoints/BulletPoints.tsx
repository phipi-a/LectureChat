import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import { LoadingButton, Skeleton } from "@mui/lab";
import React, { Suspense, useContext, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

import {
  BulletPointI,
  BulletPointsI,
  BulletPointsJsonI,
} from "@/common/Interfaces/Interfaces";
import { Database } from "@/common/Interfaces/supabaseTypes";
import { time2sec } from "@/utils/helper";
import { useGetDataN2 } from "@/utils/supabase/supabaseData";
import { useUserData } from "@/utils/supabase/supabaseQuery";
import { Box } from "@mui/material";
import { BulletPoint } from "./BulletPoint";

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
  bulletPoints: BulletPointI[] | undefined;
  bulletPointsId: number;
  setPlayPosition: ({ pos }: { pos: number }) => void;
  setCurrentPage: (page: number) => void;
  onOpenChat: (a: BulletPointI, bulletPointId: number) => void;
}) {
  return (
    <>
      {bulletPoints &&
        bulletPoints.map((bulletPoint: BulletPointI, i) => (
          <BulletPoint
            key={
              bulletPoint.bullet_point + bulletPoint.start + bulletPoint.page
            }
            isFirst={i === 0}
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
                pos: time2sec(section.start),
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

function BulletPointListFallback() {
  return (
    <>
      <Skeleton height={50} width={"80%"} />
      <Skeleton width={"100%"} />
      <Skeleton width={"30%"} />
      <Skeleton height={50} width={"85%"} />
      <Skeleton width={"95%"} />
      <Skeleton width={"100%"} />
      <Skeleton width={"40%"} />
    </>
  );
}

export function BulletPoints({
  roomId,
  onOpenChat,
}: {
  roomId: string;
  onOpenChat: (a: BulletPointI, bulletPointId: number) => void;
}) {
  const { segments, setCurrentPage, setPlayPosition, setBulletPoints } =
    useContext(RoomContext);
  const { userId } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [userData, setUserData] = useUserData(userId, queryClient);
  const isTestRoom = roomId === "000000" && userId === null;
  const mutation = useMutation({
    mutationFn: async () => {
      return supabase.functions.invoke("bulletpoints", {
        body: {
          roomId,
          openaiKey: userData?.data?.data?.openai_key,
          lastBulletpoints: isTestRoom
            ? JSON.stringify(bulletPointsData.data?.content.bullet_points)
            : undefined,
        },
      });
    },
    onSuccess: (res) => {
      if (!res) return;

      if (res.data) {
        setBulletPointsData(res.data);
        setBulletPoints(res.data);
      }
    },
  });

  const getInitBulletPointsQuery = supabase
    .from("bulletpoints")
    .select("*")
    .eq("room_id", roomId);

  if (!isTestRoom) {
    getInitBulletPointsQuery.eq("user_id", userId);
  }

  const [bulletPointsData, setBulletPointsData] = useGetDataN2<
    BulletPointsI,
    Database["public"]["Tables"]["bulletpoints"]["Row"]
  >(
    ["bulletpoints", roomId],
    getInitBulletPointsQuery.single(),
    (data) => {
      if (data.data === null) {
        return {
          content: {
            bullet_points: [],
            sections: undefined,
            isLong: false,
          },
          id: undefined,
        };
      }
      const bpjson = JSON.parse(
        data.data.bulletpoints as string
      ) as unknown as BulletPointsJsonI;

      const bps = {
        content: bpjson,
        id: data.data.id,
      } as BulletPointsI;
      return bps;
    },
    queryClient,
    {
      onSuccess: (data) => {
        // If no bullet points are found
        if (data.id === undefined) {
          console.log("no bullet points found");
        }
      },
    }
  );

  useEffect(() => {
    if (bulletPointsData.data?.id === undefined) {
      mutation.mutate();
    }
  }, []);

  // Read bulletpoints from db

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

        prevSegmentLength.current = segments.length;
      }
    }
  }, [segments.length]);

  const bulletPoints = bulletPointsData.data?.content;
  const bulletPointsId = bulletPointsData.data?.id;
  console.log("Bulletpoints content", bulletPoints);

  const loading = bulletPointsData.isLoading || mutation.isLoading;
  const isVideo = bulletPoints && "isLong" in bulletPoints;

  return (
    <div>
      <Box display="flex" justifyContent="center">
        <LoadingButton
          variant="outlined"
          onClick={() => {
            mutation.mutate();
          }}
          loading={loading}
          loadingIndicator="Generating..."
        >
          Regenerate
        </LoadingButton>
      </Box>
      {bulletPoints && (
        <>
          {isVideo ? (
            <VideoBulletPoints
              bulletPoints={bulletPoints as VideoBulletPoints}
              setPlayPosition={setPlayPosition}
              setCurrentPage={setCurrentPage}
              onOpenChat={onOpenChat}
              bulletPointsId={bulletPointsId!}
            />
          ) : (
            <BulletPointList
              bulletPoints={(bulletPoints as BulletPointsJsonI).bullet_points}
              setPlayPosition={setPlayPosition}
              setCurrentPage={setCurrentPage}
              onOpenChat={onOpenChat}
              bulletPointsId={bulletPointsId!}
            />
          )}
        </>
      )}
    </div>
  );
}

export function BulletPointsSuspense({
  roomId,
  onOpenChat,
}: {
  roomId: string;
  onOpenChat: (a: BulletPointI, bulletPointId: number) => void;
}) {
  return (
    <Suspense fallback={<BulletPointListFallback />}>
      <BulletPoints roomId={roomId} onOpenChat={onOpenChat} />
    </Suspense>
  );
}

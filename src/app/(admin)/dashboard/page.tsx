"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
// import LoaderUI from "@/components/LoaderUI";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { getHostInfo, groupMeeting } from "@/lib/utils";
import { MEETING_CATEGORY } from "@/constants";
import CommentDialog from "@/components/CommentDialog";
import LoaderUI from "@/components/LoaderUI";

type Meeting = Doc<"meetings">;

function DashboardPage() {
  const users = useQuery(api.users.getUsers);
  const meetings = useQuery(api.meetings.getUserMeetings);
  const updateStatus = useMutation(api.meetings.updateMeetingStatus);

  const handleStatusUpdate = async (meetingId: Id<"meetings">, status: string) => {
    try {
      await updateStatus({ id: meetingId, status });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!meetings || !users) return <LoaderUI />;

  const groupedMeetings = groupMeeting(meetings);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/schedule">
          <Button>Schedule New Meeting</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {MEETING_CATEGORY.map(
          (category) =>
            groupedMeetings[category.id]?.length > 0 && (
              <section key={category.id}>
                {/* CATEGORY TITLE */}
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <Badge variant={category.variant}>{groupedMeetings[category.id].length}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedMeetings[category.id].map((meeting: Meeting) => {
                    const userInfo = getHostInfo(users, meeting.hostId);
                    const startTime = new Date(meeting.startTime);

                    return (
                      <Card key={meeting._id} className="hover:shadow-md transition-all">
                        {/* CANDIDATE INFO */}
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={userInfo.image} />
                              <AvatarFallback>{userInfo.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{userInfo.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{meeting.title}</p>
                            </div>
                          </div>
                        </CardHeader>

                        {/* DATE &  TIME */}
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {format(startTime, "MMM dd")}
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {format(startTime, "hh:mm a")}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                          <CommentDialog meetingId={meeting._id} />
                        </CardFooter>

                      </Card>
                    );
                  })}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}
export default DashboardPage;
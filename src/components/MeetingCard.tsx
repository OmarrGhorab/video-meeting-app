import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Meeting = Doc<"meetings">;

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const { joinMeeting } = useMeetingActions();

  const status = getMeetingStatus(meeting);
  const formattedDate = format(new Date(meeting.startTime), "EEEE, MMMM d · h:mm a");

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formattedDate}
          </div>

          <Badge
            variant={
              status === "live" ? "default" : status === "upcoming" ? "secondary" : "outline"
            }
          >
            {status === "live" ? "Live Now" : status === "upcoming" ? "Upcoming" : "Completed"}
          </Badge>
        </div>

        <CardTitle>{meeting.title}</CardTitle>
        <CardDescription className="line-clamp-2">Host: {meeting.hostName}</CardDescription>
        {meeting.description && (
          <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {status === "live" && (
          <Button className="w-full" onClick={() => joinMeeting(meeting.streamCallId)}>
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant="outline" className="w-full" disabled>
            Waiting to Start
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
export default MeetingCard;
import { clsx, type ClassValue } from "clsx";
import { addHours, intervalToDuration, isAfter, isBefore, isWithinInterval } from "date-fns";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Meeting = Doc<"meetings">;
type User = Doc<"users">;

export const groupMeeting = (meetings: Meeting[]) => {
  if (!meetings) return {};

  return meetings.reduce((acc: any, meeting: Meeting) => {
    const date = new Date(meeting.startTime);
    const now = new Date();

    if (meeting.status === "succeeded") {
      acc.succeeded = [...(acc.succeeded || []), meeting];
    } else if (meeting.status === "failed") {
      acc.failed = [...(acc.failed || []), meeting];
    } else if (isBefore(date, now)) {
      acc.completed = [...(acc.completed || []), meeting];
    } else if (isAfter(date, now)) {
      acc.upcoming = [...(acc.upcoming || []), meeting];
    }

    return acc;
  }, {});
};

export const getHostInfo = (users: User[], meetingId: string) => {
  const host = users?.find((user) => user.clerkId === meetingId);
  return {
    name: host?.name || "Unknown Hostname",
    image: host?.image,
    initials:
      host?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UI",
  };
};

export const calculateRecordingDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const duration = intervalToDuration({ start, end });

  if (duration.hours && duration.hours > 0) {
    return `${duration.hours}:${String(duration.minutes).padStart(2, "0")}:${String(
      duration.seconds
    ).padStart(2, "0")}`;
  }

  if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
  }

  return `${duration.seconds} seconds`;
};

export const getMeetingStatus = (meeting: Meeting) => {
  const now = new Date();
  const meetingStartTime = meeting.startTime;
  const endTime = addHours(meetingStartTime, 1);

  if (
    meeting.status === "completed" ||
    meeting.status === "failed" ||
    meeting.status === "succeeded"
  )
    return "completed";
  if (isWithinInterval(now, { start: meetingStartTime, end: endTime })) return "live";
  if (isBefore(now, meetingStartTime)) return "upcoming";
  return "completed";
};
"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";

function MeetingScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const meetings = useQuery(api.meetings.getUserMeetings) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];

  const createMeeting = useMutation(api.meetings.createMeeting);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    participantId: "",
    hostIds: user?.id ? [user.id] : [],
  });

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.participantId || formData.hostIds.length === 0) {
      toast.error("Please select a participant and at least one host");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, participantId, hostIds } = formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createMeeting({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        participantId,
        hostIds,
      });

      setOpen(false);
      toast.success("Meeting scheduled successfully!");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        participantId: "",
        hostIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addHost = (hostId: string) => {
    if (!formData.hostIds.includes(hostId)) {
      setFormData((prev) => ({
        ...prev,
        hostIds: [...prev.hostIds, hostId],
      }));
    }
  };

  const removeHost = (hostId: string) => {
    if (hostId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      hostIds: prev.hostIds.filter((id) => id !== hostId),
    }));
  };

  const participants = users;
  const hosts = users;

  const selectedHosts = hosts.filter((u) =>
    formData.hostIds.includes(u.clerkId)
  );

  const availableHosts = hosts.filter(
    (u) => !formData.hostIds.includes(u.clerkId)
  );

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage meetings</p>
        </div>

        {/* DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Schedule Meeting</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Meeting title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Meeting description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* PARTICIPANT */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Participant</label>
                <Select
                  value={formData.participantId}
                  onValueChange={(participantId) => setFormData({ ...formData, participantId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select participant" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map((p) => (
                      <SelectItem key={p.clerkId} value={p.clerkId}>
                        <UserInfo user={p} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* HOSTS */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Hosts</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedHosts.map((host) => (
                    <div
                      key={host.clerkId}
                      className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      <UserInfo user={host} />
                      {host.clerkId !== user?.id && (
                        <button
                          onClick={() => removeHost(host.clerkId)}
                          className="hover:text-destructive transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {availableHosts.length > 0 && (
                  <Select onValueChange={addHost}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add host" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableHosts.map((host) => (
                        <SelectItem key={host.clerkId} value={host.clerkId}>
                          <UserInfo user={host} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* DATE & TIME */}
              <div className="flex gap-4">
                {/* CALENDAR */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* TIME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select
                    value={formData.time}
                    onValueChange={(time) => setFormData({ ...formData, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={scheduleMeeting} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Meeting"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LOADING OR MEETING CARDS */}
      {!meetings ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : meetings.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No meetings scheduled</div>
      )}
    </div>
  );
}
export default MeetingScheduleUI;

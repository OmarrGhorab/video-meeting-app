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
import { Loader2Icon, XIcon, Check, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";
import { X } from "lucide-react";

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
    participantIds: [] as string[],
    hostId: user?.id || "",
  });

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (formData.participantIds.length === 0) {
      toast.error("Please select at least one participant");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, participantIds, hostId } = formData;
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
      const hostName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      await createMeeting({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        hostId,
        users: [...participantIds, hostId],
        streamCallId: id,
        hostName,
      });
      setOpen(false);
      toast.success("Meeting scheduled successfully!");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        participantIds: [],
        hostId: user?.id || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  // Filter out the host from the participants to invite
  const participants = users.filter(userObj => userObj.clerkId !== user?.id);

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage meetings</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Schedule Meeting</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Meeting title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Meeting description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Participants</label>
                <div className="relative">
                  <Select
                    value={formData.participantIds[0] || ""}
                    onValueChange={(value) => {
                      if (!formData.participantIds.includes(value)) {
                        setFormData({
                          ...formData,
                          participantIds: [...formData.participantIds, value],
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Add participants" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {participants.map((p) => (
                        <SelectItem 
                          key={p.clerkId} 
                          value={p.clerkId}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {formData.participantIds.includes(p.clerkId) ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4" />
                            )}
                            <UserInfo user={p} />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.participantIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.participantIds.map((participantId) => {
                      const participant = participants.find(p => p.clerkId === participantId);
                      if (!participant) return null;
                      return (
                        <div
                          key={participantId}
                          className="group flex items-center gap-2 bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-full text-sm transition-colors"
                        >
                          <UserInfo user={participant} />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                participantIds: formData.participantIds.filter(
                                  (id) => id !== participantId
                                ),
                              });
                            }}
                            className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
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

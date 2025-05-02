import { Users2, Video, CalendarClock, Archive } from "lucide-react";

export const MEETING_CATEGORY = [
  { id: "upcoming", title: "Upcoming Meetings", variant: "outline" },
  { id: "completed", title: "Completed", variant: "secondary" },
] as const;

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export const QUICK_ACTIONS = [
    {
      icon: Video, // More intuitive for "New Call"
      title: "New Call",
      description: "Start an instant meeting",
      color: "indigo-500",
      gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    },
    {
      icon: Users2, // Sharper version of "Users" icon
      title: "Join Meeting",
      description: "Enter via invitation link",
      color: "violet-500",
      gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
    },
    {
      icon: CalendarClock, // More dynamic icon for "Schedule"
      title: "Schedule",
      description: "Plan upcoming meeting",
      color: "cyan-500",
      gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    },
    {
      icon: Archive, // "Recordings" feel better as Archive box
      title: "Recordings",
      description: "Access past meetings",
      color: "amber-500",
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    },
  ];
  


export type QuickActionType = (typeof QUICK_ACTIONS)[number];
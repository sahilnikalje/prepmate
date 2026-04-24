// STEP-1: Define all dummy data in one place
//! Later in integration step, this gets replaced by real API data

export const dummyUser = {
  name: "Sahil",
}

export const dummyStats = [
  {
    id: 1,
    icon: "record_voice_over",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    badge: "+12% this week",
    badgeColor: "text-tertiary-dim",
    label: "Total Interviews",
    value: "24",
    suffix: "",
    highlight: false,
  },
  {
    id: 2,
    icon: "star",
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
    badge: "Top 5% Users",
    badgeColor: "text-secondary",
    label: "Average Score",
    value: "82",
    suffix: "/100",
    highlight: false,
  },
  {
    id: 3,
    icon: "military_tech",
    iconColor: "text-tertiary-dim",
    iconBg: "bg-[#48e5d0]/10",
    badge: "Best in Product Management",
    badgeColor: "text-on-surface-variant",
    label: "Best Score",
    value: "94",
    suffix: "/100",
    highlight: true, // purple left border
  },
]

export const dummyInterviews = [
  {
    id: 1,
    icon: "work",
    iconColor: "text-primary",
    iconBorder: "group-hover:border-primary/30",
    scoreColor: "text-primary",
    hoverBg: "hover:bg-primary/20",
    hoverText: "hover:text-primary",
    title: "Senior Product Designer",
    date: "Oct 24, 2023",
    company: "Google",
    score: "88%",
  },
  {
    id: 2,
    icon: "terminal",
    iconColor: "text-secondary",
    iconBorder: "group-hover:border-secondary/30",
    scoreColor: "text-secondary",
    hoverBg: "hover:bg-secondary/20",
    hoverText: "hover:text-secondary",
    title: "Backend Engineer (L5)",
    date: "Oct 21, 2023",
    company: "Stripe",
    score: "76%",
  },
  {
    id: 3,
    icon: "leaderboard",
    iconColor: "text-[#48e5d0]",
    iconBorder: "group-hover:border-[#48e5d0]/30",
    scoreColor: "text-[#48e5d0]",
    hoverBg: "hover:bg-[#48e5d0]/20",
    hoverText: "hover:text-[#48e5d0]",
    title: "Marketing Strategist",
    date: "Oct 18, 2023",
    company: "Meta",
    score: "91%",
  },
]
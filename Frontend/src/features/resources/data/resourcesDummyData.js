// STEP-1: All static dummy data for Resources page

export const recommendedResources = [
  {
    id: 1,
    title: "Communication Improvement Pack",
    desc: "Master the STAR method and non-verbal cues. This pack focuses on articulating technical concepts to non-technical stakeholders.",
    badge: "Recommended based on weak communication score",
    badgeColor: "bg-secondary/20 text-secondary",
    duration: "45 min",
    tags: ["Soft Skills", "Leadership"],
    tagStyle: "bg-white/5 text-on-surface-variant",
    cta: "Start Path",
    ctaStyle: "bg-gradient-to-r from-primary to-secondary text-on-primary-fixed",
    size: "large",
  },
  {
    id: 2,
    title: "React Advanced Interview Questions",
    desc: "Deep dive into reconciliation, concurrent rendering, and server components. Perfect for senior-level technical rounds.",
    badge: "Matched with your React interest",
    badgeColor: "bg-primary/20 text-primary",
    duration: "1.5 hrs",
    tags: ["Frontend", "Senior"],
    tagStyle: "bg-white/5 text-on-surface-variant",
    cta: "View Details",
    ctaStyle: "bg-surface-container-high text-on-surface hover:bg-surface-variant",
    size: "large",
  },
]

export const categories = [
  { id: 1, label: "DSA",           icon: "code_blocks", count: 142, color: "text-primary",   bg: "bg-primary/10"   },
  { id: 2, label: "React",         icon: "javascript",  count: 85,  color: "text-secondary", bg: "bg-secondary/10" },
  { id: 3, label: "Node.js",       icon: "terminal",    count: 64,  color: "text-[#48e5d0]", bg: "bg-[#48e5d0]/10" },
  { id: 4, label: "System Design", icon: "hub",         count: 110, color: "text-primary",   bg: "bg-primary/10"   },
  { id: 5, label: "Behavioral",    icon: "chat",        count: 45,  color: "text-secondary", bg: "bg-secondary/10" },
  { id: 6, label: "HR",            icon: "person",      count: 30,  color: "text-[#48e5d0]", bg: "bg-[#48e5d0]/10" },
]

export const practiceSets = [
  {
    id: 1,
    title: "Top React Rapid Fire",
    meta: "25 Questions • Intermediate Difficulty",
    badge: "New Set",
    badgeColor: "text-[#48e5d0] bg-[#48e5d0]/10",
    icon: "javascript",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    id: 2,
    title: "Google Behavioral Round",
    meta: "12 Scenario-based Tasks • Expert Difficulty",
    badge: "Top Rated",
    badgeColor: "text-primary bg-primary/10",
    icon: "psychology",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: 3,
    title: "JavaScript Machine Round",
    meta: "30 Questions • Advanced Difficulty",
    badge: "Popular",
    badgeColor: "text-secondary bg-secondary/10",
    icon: "terminal",
    iconBg: "bg-[#48e5d0]/10",
    iconColor: "text-[#48e5d0]",
  },
  {
    id: 4,
    title: "Backend API Architecture",
    meta: "18 Questions • Intermediate Difficulty",
    badge: "Trending",
    badgeColor: "text-[#48e5d0] bg-[#48e5d0]/10",
    icon: "hub",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
]

export const continueLearning = [
  {
    id: 1,
    title: "System Design Case Studies",
    progress: 65,
    barColor: "bg-primary",
    textColor: "text-primary",
    borderColor: "border-primary",
  },
  {
    id: 2,
    title: "Advanced SQL Tuning",
    progress: 20,
    barColor: "bg-secondary",
    textColor: "text-secondary",
    borderColor: "border-secondary",
  },
]

export const aiMentorInsight = {
  message: "Your analytics show strong technical skills but weaker communication clarity.",
  highlight: "Behavioral storytelling",
  highlightColor: "text-[#48e5d0]",
}
import {
  FaGithub,
  FaLinkedin,
  FaStackOverflow,
  FaTwitter,
  FaBriefcase,
  FaBuilding
} from "react-icons/fa";
import type { IconType } from "react-icons";

export const profile = {
  name: "Your Name",
  title: "Full-Stack Developer",
  email: "you@example.com",
  phone: "+44 7000 000000",
  location: "London, United Kingdom",
  yearsExperience: 4,
  technologiesCount: 32
};

export type ProfileLink = {
  label: string;
  href: string;
  icon: IconType;
  color: string;
};

export const profileLinks: ProfileLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yourname",
    icon: FaLinkedin,
    color: "#00f0ff"
  },
  {
    label: "GitHub",
    href: "https://github.com/yourname",
    icon: FaGithub,
    color: "#ffffff"
  },
  {
    label: "Indeed Resume",
    href: "https://profile.indeed.com",
    icon: FaBriefcase,
    color: "#7b2ff7"
  },
  {
    label: "Glassdoor",
    href: "https://www.glassdoor.co.uk",
    icon: FaBuilding,
    color: "#a7ff3c"
  },
  {
    label: "Wellfound",
    href: "https://wellfound.com",
    icon: FaBriefcase,
    color: "#ff00e5"
  },
  {
    label: "Stack Overflow",
    href: "https://stackoverflow.com/users",
    icon: FaStackOverflow,
    color: "#f48024"
  },
  {
    label: "X",
    href: "https://x.com/yourname",
    icon: FaTwitter,
    color: "#00f0ff"
  }
];

export const techFilters = [
  "All",
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "AI/ML"
];


import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Wo", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Tes", href: "#" },
];

export const testimonials = [
  {
    user: "John Doe",
    company: "Stellar Solutions",
    image: user1,
    text: "lorem50",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "lorem50",
  },
  {
    user: "David Johnson",
    company: "Quantum Innovations",
    image: user3,
    text: "lorem50",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Dynamics",
    image: user4,
    text: "lorem50",
  },
  {
    user: "Michael Wilson",
    company: "Visionary Creations",
    image: user5,
    text: "lorem50",
  },
  {
    user: "Emily Davis",
    company: "Synergy Systems",
    image: user6,
    text: "lorem50",
  },
];

export const features = [
  {
    icon: <BotMessageSquare />,
    text: "Real-Time Gesture Recognition",
    description:
      "Utilizes computer vision and AI to recognize Indian Sign Language gestures instantly for seamless communication.",
  },
  {
    icon: <Fingerprint />,
    text: "Cross-Platform Deployment",
    description:
      "Deploy the ANUVADAK app across web, mobile, and VR platforms using a unified codebase for maximum reach.",
  },
  {
    icon: <ShieldHalf />,
    text: "Pre-trained Models",
    description:
      "Integrate state-of-the-art gesture detection models without needing to train from scratch — fast, accurate, and ready to use.",
  },
];


export const checklistItems = [
  {
    title: "Real-time ISL Translation",
    description: "Translate text and voice into Indian Sign Language instantly using AI-powered gesture rendering.",
  },
  {
    title: "Webcam Gesture Detection",
    description: "Use your webcam to recognize and interpret sign language gestures live.",
  },
  {
    title: "Multi-language Support",
    description: "Supports translation from multiple regional languages into ISL, promoting inclusivity.",
  },
  {
    title: "Learn & Practice Mode",
    description: "Interactive lessons and practice sessions for users to learn Indian Sign Language.",
  },
  {
    title: "Accessible Interface",
    description: "Built for accessibility with clear visuals, responsive layout, and keyboard navigation.",
  },
];


export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Text-to-ISL translation",
      "Basic gesture recognition",
      "Limited daily translations",
      "Community forum access"
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Unlimited ISL translations",
      "Advanced gesture recognition",
      "Offline translation mode",
      "Priority support",
    ],
  },
  {
    title: "Enterprise",
    price: "Custom",
    features: [
      "Custom dataset integration",
      "Dedicated support & onboarding",
      "Team collaboration features",
      "Analytics dashboard",
    ],
  }
  
];


export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "User Guide" },
  { href: "#", text: "ISL Tutorials" },
  { href: "#", text: "API Access" },
  { href: "#", text: "Help Center" },
];

export const platformLinks = [
  { href: "#", text: "Core Features" },
  { href: "#", text: "Supported Gestures" },
  { href: "#", text: "Browser & Device Support" },
  { href: "#", text: "Download App" },
  { href: "#", text: "Changelog" },
];

export const communityLinks = [
  { href: "#", text: "Webinars" },
  { href: "#", text: "Workshops" },
  { href: "#", text: "ISL Contributor Program" },
  { href: "#", text: "Slack Community" },
  { href: "#", text: "GitHub Discussions" },
];

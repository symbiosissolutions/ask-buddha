export type ActivityType = "chat" | "mind-map";

export interface Activity {
  id: ActivityType;
  label: string;
  description: string;
  imagePath: string;
  altText: string;
  span: 1 | 2;
}

export const ACTIVITIES: Activity[] = [
  {
    id: "chat",
    label: "Chat with Buddha",
    description: "Converse with the Buddha for guidance and peace.",
    imagePath: "/src/assets/activities/chat.jpg",
    altText: "A peaceful Buddha statue in meditation",
    span: 2,
  },
  {
    id: "mind-map",
    label: "Create Mandala Mind Map",
    description: "Visualize your thoughts in a sacred geometry.",
    imagePath: "/src/assets/activities/mind-map.jpg",
    altText: "A colorful mandala pattern",
    span: 1,
  },
];

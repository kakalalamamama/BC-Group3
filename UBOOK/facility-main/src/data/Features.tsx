// features.ts
export type Feature = {
  title: string;
  description: string;
  icon: string;
  facilityId: number;
};

const features: Feature[][] = [
  [
    {
      title: "Cooking Studio",
      description:
        "Kitchen space for teaching pasta workshops.\n(Goldhahn & Sampson Cooking School, Berlin)",
      icon: "🍳",
      facilityId: 1,
    },
    {
      title: "Art Workshop Room",
      description:
        "Tables, sinks, and supplies for watercolor, acrylic painting, or clay sculpting.\n(Art Space Berlin, Berlin)",
      icon: "🎨",
      facilityId: 2,
    },
    {
      title: "Music Rehearsal Room",
      description:
        "Instruments and soundproofing for music lessons or solo band practice.\n(Noisy Rooms, Berlin)",
      icon: "🎸",
      facilityId: 3,
    },
    {
      title: "Pop-up Retail Booth",
      description:
        "Temporary space for handmade crafts, indie fashion, or test products.\n(PopKudamm – Creative Pop-up Mall, Berlin)",
      icon: "🛍️",
      facilityId: 4,
    },
    {
      title: "Coding Lab",
      description:
        "Equipped with PCs or allow laptop plug-in for Python, Web dev, or data workshops.\n(ReDI School of Digital Integration, Berlin)",
      icon: "💻",
      facilityId: 5,
    },
    {
      title: "Freelance Coach Room",
      description:
        "Space used by career coaches, language coaches, or soft skills trainers.\n(St. Oberholz Co-working – Coaching Rooms, Berlin)",
      icon: "🧑‍🏫",
      facilityId: 6,
    },
  ],
];

export default features;

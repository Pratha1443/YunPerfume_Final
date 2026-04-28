// REFERENCE ONLY — live product data is served from Cloudflare D1.
// See scripts/seed.ts for how this data maps to the database.
// Do not use this file as a data source after Phase 4 is complete.

import type { StaticImageData } from "next/image";
import mogra from "@/assets/fragrance-mogra.jpg";
import oud from "@/assets/fragrance-oud.jpg";
import sandal from "@/assets/fragrance-sandal.jpg";
import chai from "@/assets/fragrance-chai.jpg";


export interface Fragrance {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  family: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  story: string;
  price: number; // INR for 50ml
  image: StaticImageData;
  index: string; // 01, 02 etc
  hue: string; // for accent treatments
}

export const fragrances: Fragrance[] = [
  {
    id: "mogra-noir",
    slug: "mogra-noir",
    name: "Mogra Noir",
    tagline: "A monsoon evening, jasmine in bloom.",
    family: "Floral · Warm",
    notes: {
      top: ["Bergamot", "Pink Pepper"],
      heart: ["Mogra (Indian Jasmine)", "Tuberose"],
      base: ["Amber", "White Musk"],
    },
    story:
      "Picked at dawn from gardens outside Madurai, mogra opens with quiet intensity — sweet, narcotic, alive. We pair it with smoked amber for the hours after sunset.",
    price: 4800,
    image: mogra,
    index: "01",
    hue: "#C4622D",
  },
  {
    id: "oud-vara",
    slug: "oud-vara",
    name: "Oud Vārā",
    tagline: "Smoke, leather, and the patience of wood.",
    family: "Woody · Resinous",
    notes: {
      top: ["Saffron", "Cardamom"],
      heart: ["Assam Oud", "Damask Rose"],
      base: ["Sandalwood", "Tobacco"],
    },
    story:
      "Vārā means circle, the slow turning of seasons. Aged oud from Assam meets Bulgarian rose — a fragrance that deepens, hour by hour, into something quietly devotional.",
    price: 6800,
    image: oud,
    index: "02",
    hue: "#7A3B1F",
  },
  {
    id: "sandal-velvet",
    slug: "sandal-velvet",
    name: "Sandal Velvet",
    tagline: "Mysore sandalwood, rendered into stillness.",
    family: "Woody · Creamy",
    notes: {
      top: ["Coriander", "Iris"],
      heart: ["Mysore Sandalwood", "Vetiver"],
      base: ["Cashmeran", "Vanilla Bourbon"],
    },
    story:
      "Sandalwood is the scent of meditation halls and grandmother's wardrobes. Soft, warm, intimate — a fragrance that listens before it speaks.",
    price: 5400,
    image: sandal,
    index: "03",
    hue: "#A98F6F",
  },
  {
    id: "chai-atelier",
    slug: "chai-atelier",
    name: "Chai Atelier",
    tagline: "A morning ritual, bottled.",
    family: "Gourmand · Spiced",
    notes: {
      top: ["Black Cardamom", "Cinnamon Bark"],
      heart: ["Assam Tea Leaf", "Ginger"],
      base: ["Tonka Bean", "Brown Sugar"],
    },
    story:
      "The first cup of chai at a roadside stall in Varanasi — steam, spice, and the hush before the city wakes. Equal parts comfort and curiosity.",
    price: 4200,
    image: chai,
    index: "04",
    hue: "#A06A2D",
  },
];

export const findFragrance = (slug: string) =>
  fragrances.find((f) => f.slug === slug);

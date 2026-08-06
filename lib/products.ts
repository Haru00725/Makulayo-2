export type FragranceNote = {
  top: string;
  heart: string;
  base: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  notes: FragranceNote;
  image: string;
};

export const products: Product[] = [
  {
    id: "m1",
    name: "Apex",
    description: "A bright, opening statement of bergamot and pink pepper, settling into a deep cedar base.",
    notes: {
      top: "Bergamot, Pink Pepper, Elemi",
      heart: "Incense, Orris, Vetiver",
      base: "Cedarwood, Amber, White Musk",
    },
    image: "/APEX.png",
  },
  {
    id: "m2",
    name: "Crimson Eden",
    description: "A rich, floral heart with an unexpected leather dry down.",
    notes: {
      top: "Saffron, Cardamom, Mandarin",
      heart: "Rose Absolute, Jasmine, Leather",
      base: "Patchouli, Sandalwood, Vanilla",
    },
    image: "/crimson eden.png",
  },
  {
    id: "m3",
    name: "Tidal Rush",
    description: "Crisp and botanical, inspired by morning rain on wet stones.",
    notes: {
      top: "Galbanum, Juniper, Cypress",
      heart: "Violet Leaf, Fig, Clary Sage",
      base: "Oakmoss, Vetiver, Geosmin",
    },
    image: "/Tidal rush.png",
  },
  {
    id: "m4",
    name: "Golden Ember",
    description: "A smoky, resinous amber that commands the room.",
    notes: {
      top: "Black Pepper, Nutmeg",
      heart: "Labdanum, Myrrh, Guaiac Wood",
      base: "Oud, Benzoin, Tonka Bean",
    },
    image: "/Golden Ember.png",
  },
  {
    id: "m5",
    name: "Veloura Noir",
    description: "Intimate and soft, a skin scent elevated to pure luxury.",
    notes: {
      top: "Ambrette Seed, Pear",
      heart: "Iris, Cashmeran",
      base: "Iso E Super, Ambroxan, Musk",
    },
    image: "/Veloura Noir.png",
  }
];

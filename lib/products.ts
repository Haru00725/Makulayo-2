export type FragranceNote = {
  top: string;
  heart: string;
  base: string;
};

export type Product = {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  family?: string;
  notes: FragranceNote;
  whyLoveIt?: string[];
  bestWorn?: string;
  gender?: string;
  suitableFor?: string[];
  image: string;
};

export const products: Product[] = [
  {
    id: "m1",
    name: "Apex",
    tagline: "The Spirit of Victory.",
    description: "Apex is crafted for those who lead with confidence and leave a lasting impression. Inspired by the energy of champions, this fragrance opens with a burst of fresh marine accords and vibrant citrus, delivering an instantly invigorating sensation. As it evolves, aromatic spices and refined lavender add depth and sophistication, creating a scent that is both dynamic and effortlessly elegant.\n\nThe fragrance settles into a powerful blend of warm amber, rich woods, and sensual musk, leaving behind a bold, masculine trail that commands attention without overpowering.\n\nDesigned for those who embrace ambition and confidence, Apex is the perfect signature scent for every occasion.",
    family: "Fresh • Aquatic • Woody",
    notes: {
      top: "Sea Notes, Grapefruit, Mandarin Orange",
      heart: "Bay Leaf, Jasmine",
      base: "Ambergris Accord, Guaiac Wood, Oakmoss, Patchouli",
    },
    whyLoveIt: [
      "Fresh aquatic opening with vibrant citrus",
      "Aromatic heart with refined masculine character",
      "Warm woody and amber finish",
      "Perfect for everyday wear and special occasions",
      "Long-lasting Eau De Parfum concentration"
    ],
    bestWorn: "Ideal for Spring, Summer, and Autumn, whether you're at the office, the gym, a casual outing, or an evening event. Apex delivers a clean, confident presence from day to night.",
    gender: "Primarily Masculine • Unisex Appeal",
    suitableFor: ["Men", "Sports", "Everyday Wear", "Office & Casual", "Day & Evening", "Spring • Summer • Autumn"],
    image: "/apex.png",
  },
  {
    id: "m2",
    name: "Crimson Eden",
    tagline: "A Bite of Pure Temptation.",
    description: "Crimson Eden is a vibrant expression of joy, elegance, and irresistible charm. Bursting open with the crisp sweetness of juicy red apple and sparkling fruits, it creates an instantly refreshing and addictive first impression. As the fragrance unfolds, delicate white florals bloom gracefully, adding a soft, romantic sophistication that feels effortlessly luxurious.\n\nThe scent settles into a smooth blend of creamy vanilla, warm amber, and sensual musk, leaving behind a velvety trail that lingers beautifully from day to night.\n\nCrafted for those who embrace confidence and individuality, Crimson Eden is a fragrance that captures the perfect balance of playful sweetness and timeless elegance.",
    family: "Floral • Fruity • Gourmand",
    notes: {
      top: "Juicy Red Apple, Lychee, Blackcurrant, Pink Grapefruit",
      heart: "Wild Berries, Raspberry Blossom, Jasmine, May Rose",
      base: "Sugar, Vanilla, Amber, Musk, Moss",
    },
    whyLoveIt: [
      "Bright juicy apple opening with vibrant fruity freshness",
      "Elegant floral heart with a smooth gourmand touch",
      "Soft vanilla and amber finish that lasts for hours",
      "Fresh, playful, and effortlessly luxurious",
      "Perfect for everyday wear and special occasions",
      "Long-lasting Eau De Parfum concentration"
    ],
    bestWorn: "Ideal for Spring, Summer, and Autumn, whether you're heading to brunch, a casual outing, a romantic date, or an evening celebration. Crimson Eden leaves behind a vibrant, elegant, and unforgettable signature.",
    gender: "Unisex (Feminine-Leaning)\n\nCrimson Eden is crafted for anyone who loves vibrant fruity-floral fragrances. Its juicy apple, delicate florals, and creamy vanilla create a beautifully balanced scent that can be enjoyed by both men and women while maintaining a slightly feminine character.",
    suitableFor: ["Unisex", "Everyday Wear", "Office & Casual", "Date Nights", "Day & Evening", "Spring • Summer • Autumn"],
    image: "/crimson-eden.png",
  },
  {
    id: "m3",
    name: "Tidal Rush",
    tagline: "Ride the Wave of Confidence.",
    description: "Tidal Rush is an electrifying fragrance that captures the power of the ocean and the thrill of endless adventure. It opens with a vibrant burst of fresh citrus and crisp aquatic accords, delivering an invigorating wave of energy from the very first spray. As the scent unfolds, aromatic spices blend seamlessly with smooth florals, creating a refined balance of freshness and depth.\n\nThe fragrance settles into a luxurious base of warm amber, rich woods, and sensual musk, leaving behind a bold, magnetic trail that lingers long after you've left the room.\n\nCrafted for those who move with confidence and embrace every moment, Tidal Rush is a statement of strength, elegance, and modern sophistication.",
    family: "Fresh • Aquatic • Aromatic",
    notes: {
      top: "Bergamot, Mint, Artemisia",
      heart: "Lavender, Dark Chocolate, Benzoin",
      base: "Vanilla, White Musk, Tonka Bean",
    },
    whyLoveIt: [
      "Fresh aquatic opening with sparkling citrus",
      "Smooth aromatic heart with refined sweetness",
      "Warm woody amber finish",
      "Excellent longevity and strong projection",
      "Perfect for everyday wear and evening occasions",
      "Long-lasting Eau De Parfum concentration"
    ],
    bestWorn: "Ideal for Spring, Summer, and Autumn, whether you're heading to the office, a weekend getaway, a dinner date, or a night out. Tidal Rush delivers an energetic yet sophisticated presence that transitions effortlessly from day to night.",
    gender: "Masculine-Leaning Unisex\n\nWhile Tidal Rush has a fresh, aquatic character traditionally associated with men's fragrances, its smooth fruity and amber notes make it an excellent choice for anyone who enjoys clean, modern, and long-lasting scents.",
    suitableFor: ["Men", "Unisex", "Everyday Wear", "Office & Casual", "Date Nights", "Day & Evening", "Spring • Summer • Autumn"],
    image: "/tidal-rush.png",
  },
  {
    id: "m4",
    name: "Golden Ember",
    tagline: "Where Warmth Becomes Luxury.",
    description: "Golden Ember is a rich and captivating fragrance that wraps you in an aura of warmth, elegance, and irresistible sweetness. It opens with an inviting blend of aromatic spices and smooth gourmand notes, creating a bold first impression that feels both luxurious and comforting. As the fragrance unfolds, creamy sweetness and refined florals add depth, revealing a sophisticated heart that is both modern and timeless.\n\nThe scent settles into a sensual base of warm amber, precious woods, vanilla, and musk, leaving behind an unforgettable trail that lingers beautifully on the skin.\n\nCrafted for those who appreciate refined luxury, Golden Ember is the perfect expression of confidence, sophistication, and timeless charm.",
    family: "Amber • Gourmand • Spicy",
    notes: {
      top: "Cinnamon, Nutmeg, Bergamot",
      heart: "Praline, Dates, Tuberose, Mahonial",
      base: "Vanilla, Amberwood, Myrrh, Benzoin, Tonka Bean, Akigalawood",
    },
    whyLoveIt: [
      "Rich gourmand opening with warm spices",
      "Smooth vanilla and amber dry down",
      "Luxurious, comforting, and long-lasting",
      "Excellent projection and impressive longevity",
      "Perfect for evenings and special occasions",
      "Long-lasting Eau De Parfum concentration"
    ],
    bestWorn: "Ideal for Autumn and Winter, as well as cool evenings throughout the year. Perfect for date nights, formal events, celebrations, and moments when you want to leave a memorable impression.",
    gender: "Unisex\n\nGolden Ember is crafted for anyone who appreciates rich gourmand fragrances. Its warm spices, creamy vanilla, and deep amber create a perfectly balanced scent that feels luxurious on both men and women.",
    suitableFor: ["Unisex", "Evening Wear", "Date Nights", "Parties & Special Occasions", "Autumn & Winter", "Luxury Lovers"],
    image: "/golden-ember.png",
  },
  {
    id: "m5",
    name: "Veloura Noir",
    tagline: "Where Mystery Meets Seduction.",
    description: "Veloura Noir is an irresistible expression of elegance, confidence, and modern sensuality. It opens with a luminous burst of juicy pear and sparkling pink pepper, creating a vibrant first impression that is both fresh and captivating. As the fragrance unfolds, an alluring floral heart reveals delicate white blossoms, adding depth and refined sophistication.\n\nThe scent settles into a luxurious blend of rich coffee, creamy vanilla, warm cedarwood, and soft patchouli, leaving behind a smooth, addictive trail that lingers beautifully from day to night.\n\nCrafted for those who embrace confidence and effortless glamour, Veloura Noir is a fragrance that turns every moment into an unforgettable statement.",
    family: "Amber • Floral • Gourmand",
    notes: {
      top: "Pear, Pink Pepper, Orange Blossom",
      heart: "Jasmine, Coffee, Bitter Almond, Licorice",
      base: "Vanilla, Patchouli, Cedarwood, Cashmere Wood",
    },
    whyLoveIt: [
      "Bright fruity opening with elegant florals",
      "Rich coffee and vanilla heart for an addictive character",
      "Smooth woody finish with lasting warmth",
      "Luxurious, sophisticated, and long-lasting",
      "Perfect for evenings and special occasions",
      "Long-lasting Eau De Parfum concentration"
    ],
    bestWorn: "Ideal for Autumn, Winter, and cool evenings, whether you're heading to a romantic dinner, a celebration, a formal event, or an elegant night out. Veloura Noir leaves behind a refined and unforgettable signature.",
    gender: "Unisex (Feminine-Leaning)\n\nVeloura Noir is designed for anyone who appreciates rich floral-gourmand fragrances. Its creamy vanilla, smooth coffee, and warm woods create a luxurious balance that feels elegant on both men and women, while maintaining a slightly feminine character.",
    suitableFor: ["Unisex", "Evening Wear", "Date Nights", "Parties & Special Occasions", "Autumn & Winter", "Luxury Lovers"],
    image: "/veloura-noir.png",
  }
];

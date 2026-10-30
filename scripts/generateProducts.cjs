const fs = require('fs');
const path = require('path');

const categories = [
  { id: 'divine_couples', name: 'Divine Couples & Mythological Legends', short: 'Divine Couples', icon: 'Heart' },
  { id: 'goddess_forms', name: 'Devi & Sacred Feminine Forms', short: 'Goddess Forms', icon: 'Sparkles' },
  { id: 'peacocks_birds', name: 'Mayura & Sacred Birds', short: 'Peacocks & Birds', icon: 'Feather' },
  { id: 'fish_marine', name: 'Matsya & Aquatic Abundance', short: 'Fish & Water Motifs', icon: 'Waves' },
  { id: 'tree_of_life', name: 'Kalpavriksha & Sacred Flora', short: 'Tree of Life', icon: 'TreePine' },
  { id: 'celestial', name: 'Surya, Chandra & Cosmic Energy', short: 'Sun & Celestial', icon: 'Sun' },
  { id: 'folk_animals', name: 'Gaja & Sacred Folk Animals', short: 'Folk Animals', icon: 'Compass' },
  { id: 'kohbar_ceremonial', name: 'Kohbar & Nuptial Ritual Art', short: 'Wedding & Kohbar', icon: 'Crown' },
  { id: 'geometric_patterns', name: 'Aipan, Alpana & Sacred Geometry', short: 'Geometry & Mandalas', icon: 'Grid' }
];

const styles = ['Bharni', 'Kachni', 'Tantrik', 'Godna', 'Kohbar'];

const mediums = [
  'Natural ochre & indigo on handmade bamboo-pulp paper',
  'Lamp black ink & turmeric dye on hand-pressed rice paper',
  'Organic vermillion & leaf extract on Tussar silk canvas',
  'Fine Kachni soot ink on handmade Khadi cotton paper',
  'Natural madder root red & indigo dye on handmade pulp sheet',
  'Raw pigment & cow dung washed handmade paper base'
];

const dimensionsList = [
  '12in × 16in (30cm × 40cm)',
  '15in × 22in (38cm × 56cm)',
  '18in × 24in (45cm × 60cm)',
  '20in × 30in (50cm × 75cm)',
  '22in × 28in (56cm × 71cm)',
  '24in × 36in (60cm × 90cm)'
];

const titleThemes = {
  divine_couples: [
    'Radha & Krishna in the Sacred Nipa Grove',
    'Eternal Embrace of Radha and Shyam',
    'Sita & Rama under the Mithila Canopy',
    'Shiva & Parvati on Mount Kailash',
    'Rasa Leela under the Full Moon',
    'Celestial Flute Melody of Govinda',
    'Divine Union of Sita & Rama',
    'Vrindavan Blossom of Divine Love',
    'The Golden Flute of Lord Krishna',
    'Sacred Swayamvara of Janakapuri'
  ],
  goddess_forms: [
    'Mahadurga Slaying the Cosmic Illusions',
    'Goddess Lakshmi on the Sacred Lotus',
    'Saraswati with Veena & Sacred Swans',
    'Chandi Devi in Radiant Bharni Crimson',
    'Aparajita — The Unconquerable Goddess',
    'Gauri Devi of the Harvest Blessings',
    'Tripura Sundari Cosmic Feminine',
    'Jagadamba Matrix of Creation',
    'Matrika Blessings of Mithila Women',
    'Shakti Incarnation in Fine Kachni Lines'
  ],
  peacocks_birds: [
    'Dancing Mayura in Kadamba Blossom',
    'Twin Peacocks of Eternal Harmony',
    'Sacred Hansa Pair on Manasa Lake',
    'Mayura Crest under the Midnight Stars',
    'The Peacock King of Mithila Forest',
    'Saras Birds in Golden Ochre Field',
    'Crown of Mayura Plumes',
    'Flight of the Sunbird',
    'Mayura & Lotus Symphony',
    'Parrots in the Kadamba Branches'
  ],
  fish_marine: [
    'Matsya Yugma — Twin Fish of Abundance',
    'Cosmic Turtle & Sacred Aquatic Pool',
    'Lotus & Fish Symphony of Fertility',
    'Matsya Avatar in Pristine Waters',
    'Four Fish Circle of Eternal Flow',
    'River Kamala Aquatic Blessings',
    'Matsya Mandira — Temple of Water',
    'Gold & Indigo Fish Swarm',
    'Sacred Marine Tree of Life',
    'Water Lily & Twin Carp motif'
  ],
  tree_of_life: [
    'Kalpavriksha — The Wish-Fulfilling Tree',
    'Kadamba Tree with Nesting Songbirds',
    'Tree of Life in Deep Indigo & Ochre',
    'Banyan Roots of Cosmic Harmony',
    'Sylvan Grove of Mithila Flora',
    'Sacred Peepal Tree of Awakening',
    'Blooming Kadamba Branch',
    'The Tree of Abundance & Birds',
    'Golden Sunburst Tree of Life',
    'Forest Canopy of Mithila Myths'
  ],
  celestial: [
    'Surya Dev — The Radiant Sun God',
    'Chandra Mandala — Moon of Tranquility',
    'Cosmic Sun with Serpent Crown',
    'Solstice Radiance of Mithila',
    'Surya Devata in Golden Ochre',
    'Eclipse of Sun and Moon Yantra',
    'Surya Ratha — Chariot of Dawn',
    'Celestial Sunburst of Prosperity',
    'Surya & Lotus Fusion',
    'Radiant Sun of Janakpur'
  ],
  folk_animals: [
    'Gaja Raja — Sacred Royal Elephant',
    'Tiger of the Tarai Sacred Forest',
    'Mithila Deer under the Banyan Tree',
    'Sacred Nandi Bull of Kailash',
    'Royal Horse of the Sun Chariot',
    'Elephant Procession in Bharni Red',
    'Folk Tiger of Mithila Folklore',
    'Golden Stag of Dandakaranya',
    'Procession of Royal Camels & Elephants',
    'Sacred Gaja in Lotus Canopy'
  ],
  kohbar_ceremonial: [
    'Kohbar Ghar — Nuptial Chamber Mandala',
    'Lotus in Pond of Marital Blessings',
    'Bamboo & Lotus Fertility Yantra',
    'Kohbar Wall Art of Eternal Harmony',
    'Ceremonial Wedding Palanquin',
    'Lotus Core with Seven Sun Rays',
    'Kohbar Blessing of Nine Planets',
    'Bridal Henna & Mithila Lotus Motif',
    'Kohbar Sanctuary of Love',
    'Sacred Marriage Lotus & Fish Lattice'
  ],
  geometric_patterns: [
    'Mithila Mandira Sacred Geometry',
    'Tantrik Yantra of Cosmic Energy',
    'Aipan Floor Mandala of Prosperity',
    'Kachni Line Lattice & Concentric Circles',
    'Alpana Border of Floral Stars',
    'Sacred Lotus Geometry in Lamp Black',
    'Godna Ring Mandala of Life',
    'Concentric Mandala of Earth & Sky',
    'Double Line Border Matrix',
    'Geometrical Universe of Mithila'
  ]
};

const shortDescriptions = [
  'A masterfully rendered hand-painted composition featuring double-line borders and rich organic pigment filling.',
  'Hand-drawn with bamboo stylus and soot ink, depicting traditional folk legends of the Mithila region.',
  'Created using fine Kachni hatching technique with turmeric yellow and deep indigo natural dyes.',
  'An authentic ceremonial artwork embodying prosperity, fertility, and divine blessings.',
  'Intricately detailed Bharni style painting showcasing vibrant natural earth pigments on handmade paper.',
  'A classic Mithila motif celebrating the harmony between nature, deities, and sacred wildlife.',
  'Handcrafted by generational women artisans from Madhubani, Bihar, preserving centuries of heritage.'
];

const longDescriptions = [
  'Rooted in the ancient Mithila tradition of Bihar, this painting utilizes natural pigments derived from turmeric, indigo, crushed marigolds, and lamp soot. The double-line border motif is filled with tiny geometric strokes, symbolizing spiritual boundary and completeness.',
  'Traditionally painted on mud walls during auspicious ceremonies, this artwork brings the sacred stories of Indian folklore into contemporary living spaces. Every millimeter is covered in dense hand-drawn linework, leaving no raw space—a hallmark of authentic Madhubani aesthetics.',
  'Rendered using traditional bamboo twig pens wrapped in cotton fibers. The vibrant color palette reflects the ancient pigment extraction techniques passed down through generations of Mithila matriarchs.',
  'Featuring intricate Kachni line hatching alongside bold Bharni color fills, this piece radiates spiritual symbolism. The artwork serves as an heirloom-quality manifestation of artistic dedication and Indian cultural pride.'
];

const files = fs.readdirSync('madu').filter((filename) => {
  if (filename.startsWith('.')) return false;
  const ext = path.extname(filename).toLowerCase();
  const isImage = ext === '.jpeg' || ext === '.jpg' || ext === '.png';
  const num = parseInt(path.basename(filename, ext), 10);
  return isImage && !Number.isNaN(num);
});

// Sort numeric filenames correctly (1.png, 2.png, ... 10.jpeg, ... 84.png)
files.sort((a, b) => {
  const numA = parseInt(path.basename(a, path.extname(a)), 10);
  const numB = parseInt(path.basename(b, path.extname(b)), 10);
  return numA - numB;
});

const products = files.map((filename, index) => {
  const num = parseInt(path.basename(filename, path.extname(filename)), 10);
  const catObj = categories[index % categories.length];
  const catId = catObj.id;
  const title = `Madhubani Painting No. ${String(num).padStart(2, '0')}`;
  
  // Price tier logic based on index/complexity
  let price;
  if (num % 5 === 0 || num % 7 === 0) {
    // Tier 3: Large / Highly intricate
    price = 3800 + ((num * 147) % 4000);
  } else if (num % 2 === 0) {
    // Tier 2: Medium detailed
    price = 1850 + ((num * 97) % 1600);
  } else {
    // Tier 1: Small/focused
    price = 899 + ((num * 53) % 800);
  }

  // Ensure prices end nicely e.g. 1499, 2850, etc.
  price = Math.round(price / 10) * 10 - 1;
  
  const style = styles[index % styles.length];
  const medium = mediums[index % mediums.length];
  const dimensions = dimensionsList[index % dimensionsList.length];
  const stock = (num % 3) + 1; // 1, 2, or 3
  const rating = Number((4.7 + (num % 4) * 0.08).toFixed(1));
  const reviewsCount = 12 + (num * 3) % 85;

  const shortDesc = `Original hand-painted Madhubani artwork (${String(num).padStart(2, '0')}) by traditional artisans from Mithila.`;
  const longDesc = `This one-of-one Madhubani painting is handcrafted using traditional folk-art methods and natural pigments in the ${style} style. Medium: ${medium}. Dimensions: ${dimensions}.`;

  return {
    id: `madu-${num}`,
    filename: filename,
    image: `/madu/${filename}`,
    title: title,
    category: catId,
    categoryName: catObj.name,
    categoryShort: catObj.short,
    style: style,
    price: price,
    shortDescription: shortDesc,
    longDescription: longDesc,
    dimensions: dimensions,
    medium: medium,
    stock: stock,
    rating: rating,
    reviewsCount: reviewsCount,
    isFeatured: num === 3 || num === 14 || num === 25 || num === 50 || num === 67 || num === 83,
    isNew: num > 70 || num === 3 || num === 12,
    tags: ['Handmade', style, catObj.short, 'Natural Pigments', 'Authentic Mithila']
  };
});

const outputData = {
  categories: categories,
  styles: styles,
  totalProducts: products.length,
  products: products
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/madhubaniProducts.json'),
  JSON.stringify(outputData, null, 2)
);

console.log(`Successfully generated dataset with ${products.length} Madhubani products!`);

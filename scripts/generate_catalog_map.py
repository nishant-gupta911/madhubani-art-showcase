import json
import os

catalog_map = [
    # Brand Pages
    {"filename": "1.png", "ref": "BRAND-01", "type": "brand_page", "category": "brand", "shotType": "cover", "description": "Catalog cover: Vernika Enterprises by Natasha Gupta with peacock mandala & ornate border"},
    {"filename": "2.png", "ref": "BRAND-02", "type": "brand_page", "category": "brand", "shotType": "divider", "description": "Section divider: Madhubani Painting"},
    {"filename": "31.png", "ref": "BRAND-03", "type": "brand_page", "category": "brand", "shotType": "divider", "description": "Section divider: Dupattas"},
    {"filename": "68.png", "ref": "BRAND-04", "type": "brand_page", "category": "brand", "shotType": "divider", "description": "Section divider: Bags & Files"},
    {"filename": "84.png", "ref": "BRAND-05", "type": "brand_page", "category": "brand", "shotType": "closing", "description": "Closing page: Thank You & Contact (Vernika Enterprises, Ph: 7870909889, vernikaenterprises14@gmail.com)"},

    # Madhubani Paintings
    {"filename": "3.jpeg", "ref": "P01", "type": "painting", "category": "paintings", "subCategory": "strips_and_sets", "shotType": "lifestyle", "description": "Triptych strip paintings lifestyle: parrots on black, fish on blue, floral vine on cream"},
    {"filename": "4.jpeg", "ref": "P02", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "infographic", "description": "Peacock pair on tree with fish, monochrome with red accents (11 x 26 in)"},
    {"filename": "5.jpeg", "ref": "P03", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "hero", "description": "Parrots on black scalloped scale background slim vertical strip"},
    {"filename": "6.jpeg", "ref": "P04", "type": "painting", "category": "paintings", "subCategory": "tree_of_life", "shotType": "hero", "description": "Flowering vine on cream slim vertical strip"},
    {"filename": "7.jpeg", "ref": "P05", "type": "painting", "category": "paintings", "subCategory": "fish", "shotType": "hero", "description": "Fish mandala in red vertical framed painting"},
    {"filename": "8.jpeg", "ref": "P06", "type": "painting", "category": "paintings", "subCategory": "fish", "shotType": "hero", "description": "Fish mandala in blue vertical framed painting"},
    {"filename": "9.jpeg", "ref": "P07", "type": "painting", "category": "paintings", "subCategory": "fish", "shotType": "hero", "description": "Fish mandala in green vertical framed painting"},
    {"filename": "10.jpeg", "ref": "P08", "type": "painting", "category": "paintings", "subCategory": "strips_and_sets", "shotType": "group", "description": "Set of 3 fish mandalas (blue, green, red) displayed together on wall"},
    {"filename": "11.jpeg", "ref": "P09", "type": "painting", "category": "paintings", "subCategory": "fish", "shotType": "hero", "description": "Fish spiral/scatter mandala on red framed painting"},
    {"filename": "12.jpeg", "ref": "P10", "type": "painting", "category": "paintings", "subCategory": "tree_of_life", "shotType": "infographic", "description": "Red and black Tree of Life with fish-leaf motif (18 x 14 cm)"},
    {"filename": "13.jpeg", "ref": "P11", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "hero", "description": "Peacock pair with flowering tree, red and black with triangle border"},
    {"filename": "14.jpeg", "ref": "P12", "type": "painting", "category": "paintings", "subCategory": "figures_and_deities", "shotType": "hero", "description": "Goddess Kali large detailed colorful deity painting"},
    {"filename": "15.jpeg", "ref": "P13", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "hero", "description": "Two owls on tree branch in folk art style"},
    {"filename": "16.jpeg", "ref": "P14", "type": "painting", "category": "paintings", "subCategory": "figures_and_deities", "shotType": "hero", "description": "Village lady with hand fan seated at window"},
    {"filename": "17.jpeg", "ref": "P15", "type": "painting", "category": "paintings", "subCategory": "figures_and_deities", "shotType": "hero", "description": "Mithila bride portrait with nose ring, orange veil, floral border"},
    {"filename": "18.jpeg", "ref": "P16", "type": "painting", "category": "paintings", "subCategory": "fish", "shotType": "infographic", "description": "Fish with lotus on blue waves slim vertical strip (24 x 10 cm)"},
    {"filename": "19.jpeg", "ref": "P17", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "hero", "description": "Two colorful peacocks on tree branches slim vertical"},
    {"filename": "20.jpeg", "ref": "P18", "type": "painting", "category": "paintings", "subCategory": "figures_and_deities", "shotType": "hero", "description": "Radha-Krishna divine couple slim vertical strip"},
    {"filename": "21.jpeg", "ref": "P17", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "detail", "description": "Two colorful peacocks on branches (alternate view / close)"},
    {"filename": "22.jpeg", "ref": "P19", "type": "painting", "category": "paintings", "subCategory": "figures_and_deities", "shotType": "hero", "description": "Red monochrome Kohbar ceremonial nuptial landscape"},
    {"filename": "23.jpeg", "ref": "P20", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "hero", "description": "Large peacock and Tree of Life statement landscape piece"},
    {"filename": "24.jpeg", "ref": "P21", "type": "painting", "category": "paintings", "subCategory": "figures_and_deities", "shotType": "hero", "description": "Buddha lotus mandala in black and white landscape"},
    {"filename": "25.jpeg", "ref": "P22", "type": "painting", "category": "paintings", "subCategory": "elephants", "shotType": "hero", "description": "Royal elephant with lotus on yellow background landscape"},
    {"filename": "26.jpeg", "ref": "P23", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "infographic", "description": "Peacock with ornate border (7 x 6 in / 17.78 x 15.24 cm)"},
    {"filename": "27.jpeg", "ref": "P24", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "infographic", "description": "Parrot bird face with diamond border (19 x 14 cm / 7.48 x 5.51 in)"},
    {"filename": "28.jpeg", "ref": "P25", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "infographic", "description": "Peacock on branch with leaf background (18 x 13 cm / 7.09 x 5.12 in)"},
    {"filename": "29.jpeg", "ref": "P26", "type": "painting", "category": "paintings", "subCategory": "fish", "shotType": "infographic", "description": "Fish on blue waves with red border (6 x 7 in / 15.24 x 17.78 cm)"},
    {"filename": "30.jpeg", "ref": "P27", "type": "painting", "category": "paintings", "subCategory": "peacock_and_birds", "shotType": "infographic", "description": "Peacock on tree teal background (7 in x 12 cm)"},

    # Dupattas
    {"filename": "32.jpeg", "ref": "D01", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Yellow cotton dupatta with lotus and fish Madhubani border"},
    {"filename": "33.jpeg", "ref": "D02", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Off-white dupatta with red fish and leaf border"},
    {"filename": "34.jpeg", "ref": "D03", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Pink dupatta with multicolor floral vine border"},
    {"filename": "35.jpeg", "ref": "D04", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Sky blue dupatta with black twin-fish (matsya) motif"},
    {"filename": "36.jpeg", "ref": "D05", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Cream dupatta with colorful peacock pair border"},
    {"filename": "37.jpeg", "ref": "D06", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Pink dupatta with black twin-fish motif and geometric border"},
    {"filename": "38.jpeg", "ref": "D07", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Beige dupatta with black fish arch border"},
    {"filename": "39.jpeg", "ref": "D08", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Cream dupatta with sunflower and marigold border"},
    {"filename": "40.jpeg", "ref": "D09", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Light yellow dupatta with paisley and lotus border"},
    {"filename": "41.jpeg", "ref": "D10", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Cream dupatta with colorful parrot row border"},
    {"filename": "42.jpeg", "ref": "D11", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Peach/apricot dupatta with lotus arch border"},
    {"filename": "43.jpeg", "ref": "D12", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Cream dupatta with elephant and green leaf border"},
    {"filename": "44.jpeg", "ref": "D10", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "flat", "description": "Parrot border dupatta alternate view"},
    {"filename": "45.jpeg", "ref": "D07", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "flat", "description": "Beige fish arch dupatta alternate view"},
    {"filename": "46.jpeg", "ref": "D05", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "flat", "description": "Peacock pair dupatta alternate view"},
    {"filename": "47.jpeg", "ref": "D12", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "flat", "description": "Elephant motif dupatta alternate view"},
    {"filename": "48.jpeg", "ref": "D04", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "lifestyle", "description": "Sky blue twin-fish dupatta draped with chalkboard sign"},
    {"filename": "49.jpeg", "ref": "D13", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "lifestyle", "description": "Cream dupatta with all-over bird grid pattern"},
    {"filename": "50.jpeg", "ref": "D14", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "lifestyle", "description": "Beige dupatta with kalash, lotus and ceremonial figures"},
    {"filename": "51.jpeg", "ref": "D15", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "lifestyle", "description": "Beige dupatta with circular peacock medallions"},
    {"filename": "56.jpeg", "ref": "D16", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "model", "description": "Model displaying cream dupatta with fish and lotus border"},
    {"filename": "57.jpeg", "ref": "D01", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "infographic", "description": "Infographic: Handpainted fish & lotus dupatta with callouts"},
    {"filename": "58.jpeg", "ref": "D17", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Cream dupatta with black elephant motifs & temple border"},
    {"filename": "59.jpeg", "ref": "D15", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "detail", "description": "Red peacock medallion dupatta detail & drape view"},
    {"filename": "60.jpeg", "ref": "D18", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Cream dupatta with elephant pair, lotus motifs & blue-green border"},
    {"filename": "61.jpeg", "ref": "D19", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Cream dupatta with black fish circular medallions & temple border"},
    {"filename": "62.jpeg", "ref": "D20", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "hero", "description": "Cream dupatta with colorful fish and turtle motifs with diamond border"},
    {"filename": "63.jpeg", "ref": "D21", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "infographic", "description": "Infographic: Blue dupatta with fish and floral motifs"},
    {"filename": "65.jpeg", "ref": "D22", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "infographic", "description": "Infographic: Purple-border peacock dupatta with closeups"},
    {"filename": "66.jpeg", "ref": "D23", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "infographic", "description": "Infographic: Orange/red peacock dupatta with detail shots"},
    {"filename": "67.jpeg", "ref": "D21", "type": "dupatta", "category": "dupattas", "subCategory": "womens_dupattas", "shotType": "model", "description": "Model holding blue fish and flora dupatta with USP badges"},

    # Angvastras (Men's stoles)
    {"filename": "52.jpeg", "ref": "A01", "type": "angvastra", "category": "dupattas", "subCategory": "mens_angvastra", "shotType": "model", "description": "Male model in white kurta wearing beige angvastra with fish and vine motifs"},
    {"filename": "53.jpeg", "ref": "A02", "type": "angvastra", "category": "dupattas", "subCategory": "mens_angvastra", "shotType": "model", "description": "Male model in white kurta wearing beige angvastra with peacock and vine motifs"},
    {"filename": "54.jpeg", "ref": "A03", "type": "angvastra", "category": "dupattas", "subCategory": "mens_angvastra", "shotType": "model", "description": "Male model in white kurta wearing beige angvastra with floral and fish motifs"},
    {"filename": "55.jpeg", "ref": "A04", "type": "angvastra", "category": "dupattas", "subCategory": "mens_angvastra", "shotType": "model", "description": "Male model in white kurta wearing beige angvastra with lotus and vine motifs"},
    {"filename": "64.jpeg", "ref": "A01", "type": "angvastra", "category": "dupattas", "subCategory": "mens_angvastra", "shotType": "infographic", "description": "Infographic: Handpainted fish & vine angvastra with traditional motifs callouts"},

    # Bags and Files
    {"filename": "69.jpeg", "ref": "B01", "type": "file_folder", "category": "bags_and_files", "subCategory": "file_folders", "shotType": "infographic", "description": "Infographic: Handpainted file folders set showing 5 traditional Mithila designs"},
    {"filename": "70.jpeg", "ref": "B02", "type": "pouch", "category": "bags_and_files", "subCategory": "sling_and_zip_pouches", "shotType": "group", "description": "Group of handcrafted zipper pouches and file folders on wooden desk"},
    {"filename": "71.jpeg", "ref": "B02", "type": "pouch", "category": "bags_and_files", "subCategory": "sling_and_zip_pouches", "shotType": "infographic", "description": "Infographic: Handpainted canvas zipper pouches with peacock, fish, elephant, Ganesh motifs"},
    {"filename": "72.jpeg", "ref": "B02", "type": "pouch", "category": "bags_and_files", "subCategory": "sling_and_zip_pouches", "shotType": "lifestyle", "description": "Full collection showcase: tote bag, sling pouches and stole displayed with greenery"},
    {"filename": "73.jpeg", "ref": "B03", "type": "tote_bag", "category": "bags_and_files", "subCategory": "tote_bags", "shotType": "infographic", "description": "Infographic: Classic canvas tote bag (18 x 14 x 4 in) with fish/peacock circular mandala"},
    {"filename": "74.jpeg", "ref": "B04", "type": "pouch", "category": "bags_and_files", "subCategory": "hand_purses_and_handbags", "shotType": "infographic", "description": "Infographic: Handpainted large clutch / pouch with Radha-Krishna motif and faux-leather base"},
    {"filename": "75.jpeg", "ref": "B05", "type": "tote_bag", "category": "bags_and_files", "subCategory": "tote_bags", "shotType": "infographic", "description": "Infographic: Radha-Krishna canvas tote bag with black faux-leather base & shoulder straps"},
    {"filename": "76.jpeg", "ref": "B06", "type": "tote_bag", "category": "bags_and_files", "subCategory": "tote_bags", "shotType": "infographic", "description": "Infographic: Two-sided fish mandala canvas tote bag with lotus back pocket"},
    {"filename": "77.jpeg", "ref": "B07", "type": "hand_purse", "category": "bags_and_files", "subCategory": "hand_purses_and_handbags", "shotType": "infographic", "description": "Infographic: Grey hand purse with black fish mandala motif and inner pocket"},
    {"filename": "78.jpeg", "ref": "B08", "type": "handbag", "category": "bags_and_files", "subCategory": "hand_purses_and_handbags", "shotType": "infographic", "description": "Infographic: Natural beige canvas handbag with circular fish motif"},
    {"filename": "79.jpeg", "ref": "B09", "type": "handbag", "category": "bags_and_files", "subCategory": "hand_purses_and_handbags", "shotType": "hero", "description": "Hero product: Blue silk handbag with natural wooden handle and lotus-fish band"},
    {"filename": "80.jpeg", "ref": "B10", "type": "laptop_bag", "category": "bags_and_files", "subCategory": "laptop_bags", "shotType": "infographic", "description": "Infographic: Red-trimmed canvas laptop bag with Radha-Krishna motif (front/back views)"},
    {"filename": "81.jpeg", "ref": "B10", "type": "laptop_bag", "category": "bags_and_files", "subCategory": "laptop_bags", "shotType": "infographic", "description": "Infographic: Red-trimmed canvas laptop bag interior & detail shots"},
    {"filename": "82.jpeg", "ref": "B11", "type": "wall_hanging", "category": "bags_and_files", "subCategory": "wall_hangings", "shotType": "infographic", "description": "Infographic: 3-panel fabric wall hanging organizer with Sun and Woman with Diya (22 x 10 in)"},
    {"filename": "83.jpeg", "ref": "B12", "type": "wall_hanging", "category": "bags_and_files", "subCategory": "wall_hangings", "shotType": "infographic", "description": "Infographic: 3-panel fabric wall hanging organizer with Sun-Moon and Birds (22 x 10 in)"}
]

print(f"Total mapped entries: {len(catalog_map)}")
with open("scripts/catalog-map.json", "w") as f:
    json.dump(catalog_map, f, indent=2)

print("Saved scripts/catalog-map.json successfully!")

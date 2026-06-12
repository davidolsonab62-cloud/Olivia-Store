"""Seed catalog data for Olivia Dante Art Store."""

CATEGORIES = [
    {"slug": "sneakers", "name": "Sneakers", "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80", "description": "Premium sneakers from the world's most coveted brands.", "order": 1},
    {"slug": "shoes", "name": "Shoes", "image": "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80", "description": "Formal and casual footwear, hand-finished.", "order": 2},
    {"slug": "sandals", "name": "Sandals", "image": "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1200&q=80", "description": "Warm-weather essentials.", "order": 3},
    {"slug": "clothing", "name": "Clothing", "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80", "description": "Ready-to-wear with intentional details.", "order": 4},
    {"slug": "watches", "name": "Watches", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80", "description": "Timepieces with provenance.", "order": 5},
    {"slug": "bags", "name": "Bags", "image": "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80", "description": "Crafted leather and statement pieces.", "order": 6},
    {"slug": "electronics", "name": "Electronics", "image": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80", "description": "Latest iPhones, Samsung, laptops & TVs.", "order": 7},
    {"slug": "art", "name": "Art", "image": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80", "description": "Original works & limited editions.", "order": 8},
    {"slug": "furniture", "name": "Furniture", "image": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80", "description": "Antique and contemporary objects.", "order": 9},
    {"slug": "jewelry", "name": "Jewelry", "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80", "description": "Gold chains and fine pieces.", "order": 10},
    {"slug": "instruments", "name": "Instruments", "image": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80", "description": "Pianos and rare instruments.", "order": 11},
]


def img(*urls):
    return list(urls)


PRODUCTS = [
    # --- Electronics: iPhones ---
    {
        "slug": "iphone-17-pro-max", "name": "iPhone 17 Pro Max", "brand": "Apple", "category_slug": "electronics",
        "description": "The pinnacle of Apple engineering. Titanium frame, ProMotion XDR display, and the new A19 Bionic.",
        "specs": {"Display": "6.9\" ProMotion XDR", "Chip": "A19 Bionic", "Storage": "256GB / 512GB / 1TB", "Camera": "48MP Fusion + 12MP Telephoto + 12MP Ultra Wide"},
        "price": 1599.0, "compare_at_price": 1799.0, "stock": 24,
        "images": img("https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["256GB", "512GB", "1TB"], "is_featured": True, "is_new": True, "is_best_seller": True, "tags": ["apple", "iphone", "premium"]
    },
    {
        "slug": "iphone-16-pro-max", "name": "iPhone 16 Pro Max", "brand": "Apple", "category_slug": "electronics",
        "description": "All the power of the Pro line in a refined titanium body.",
        "specs": {"Display": "6.7\" ProMotion", "Chip": "A18 Pro", "Storage": "256GB / 512GB / 1TB"},
        "price": 1299.0, "stock": 31,
        "images": img("https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["256GB", "512GB", "1TB"], "is_featured": True, "is_best_seller": True, "tags": ["apple", "iphone"]
    },
    {
        "slug": "iphone-15-pro", "name": "iPhone 15 Pro", "brand": "Apple", "category_slug": "electronics",
        "description": "Titanium. A17 Pro. The pro-grade iPhone you'll love.",
        "specs": {"Display": "6.1\" ProMotion", "Chip": "A17 Pro", "Storage": "128GB / 256GB / 512GB / 1TB"},
        "price": 999.0, "stock": 42,
        "images": img("https://images.unsplash.com/photo-1696446702183-be9e7779b831?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1696446701820-0f9d70b4c91f?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["128GB", "256GB", "512GB", "1TB"], "is_new": True, "tags": ["apple", "iphone"]
    },
    {
        "slug": "samsung-galaxy-s22", "name": "Samsung Galaxy S22 Ultra", "brand": "Samsung", "category_slug": "electronics",
        "description": "Pro-grade camera meets refined design. Built-in S-Pen.",
        "specs": {"Display": "6.8\" Dynamic AMOLED", "Chip": "Snapdragon 8 Gen 1", "Storage": "256GB / 512GB / 1TB"},
        "price": 849.0, "compare_at_price": 1199.0, "stock": 18,
        "images": img("https://images.unsplash.com/photo-1644571300195-de78b6b1ef0c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1610792516775-01de03eae630?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["256GB", "512GB", "1TB"], "is_best_seller": True, "tags": ["samsung", "android"]
    },
    {
        "slug": "macbook-pro-16", "name": 'MacBook Pro 16"', "brand": "Apple", "category_slug": "electronics",
        "description": "M3 Max performance. All-day battery. Liquid Retina XDR.",
        "specs": {"Display": "16.2\" Liquid Retina XDR", "Chip": "M3 Max", "Memory": "36GB Unified", "Storage": "1TB SSD"},
        "price": 3199.0, "stock": 12,
        "images": img("https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["M3 Pro", "M3 Max"], "is_featured": True, "tags": ["laptop", "apple"]
    },
    {
        "slug": "sony-bravia-65-oled", "name": "Sony Bravia 65\" OLED 4K", "brand": "Sony", "category_slug": "electronics",
        "description": "Cinema-grade OLED with cognitive processor for lifelike imagery.",
        "specs": {"Size": "65 inch", "Resolution": "4K UHD", "HDR": "Dolby Vision IQ", "Refresh": "120 Hz"},
        "price": 2399.0, "compare_at_price": 2799.0, "stock": 6,
        "images": img("https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["55\"", "65\"", "77\""], "is_new": True, "tags": ["tv", "oled"]
    },

    # --- Sneakers ---
    {
        "slug": "air-jordan-1-retro", "name": "Air Jordan 1 Retro High", "brand": "Nike", "category_slug": "sneakers",
        "description": "The silhouette that started it all. Leather upper, AIR-Sole cushioning.",
        "specs": {"Material": "Premium Leather", "Sole": "Rubber AIR-Sole", "Origin": "Vietnam"},
        "price": 199.0, "stock": 56,
        "images": img("https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["40", "41", "42", "43", "44", "45"], "is_featured": True, "is_best_seller": True, "tags": ["jordan", "nike"]
    },
    {
        "slug": "yeezy-boost-350", "name": "Yeezy Boost 350 V2", "brand": "Adidas", "category_slug": "sneakers",
        "description": "Iconic primeknit upper with Boost cushioning.",
        "specs": {"Material": "Primeknit", "Sole": "Boost"},
        "price": 289.0, "stock": 23,
        "images": img("https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["40", "41", "42", "43", "44"], "is_new": True, "tags": ["yeezy", "adidas"]
    },
    {
        "slug": "new-balance-990v6", "name": "New Balance 990v6", "brand": "New Balance", "category_slug": "sneakers",
        "description": "Made in USA craftsmanship. Pigskin and mesh upper.",
        "specs": {"Material": "Pigskin / Mesh", "Origin": "USA"},
        "price": 219.0, "stock": 38,
        "images": img("https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["40", "41", "42", "43", "44", "45"], "is_best_seller": True, "tags": ["nb", "new balance"]
    },

    # --- Shoes / Sandals ---
    {
        "slug": "oxford-cap-toe", "name": "Oxford Cap-Toe Leather", "brand": "Olivia Dante", "category_slug": "shoes",
        "description": "Hand-burnished calfskin Oxford. A timeless silhouette.",
        "specs": {"Material": "Italian calfskin", "Construction": "Goodyear welt"},
        "price": 459.0, "stock": 17,
        "images": img("https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["40", "41", "42", "43", "44", "45"], "is_featured": True, "tags": ["oxford", "formal"]
    },
    {
        "slug": "leather-sandal-cross", "name": "Leather Crossover Sandal", "brand": "Olivia Dante", "category_slug": "sandals",
        "description": "Vegetable-tanned leather, designed for long summers.",
        "specs": {"Material": "Vegetable-tanned leather", "Footbed": "Cork"},
        "price": 189.0, "stock": 41,
        "images": img("https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["38", "39", "40", "41", "42", "43"], "tags": ["summer"]
    },

    # --- Clothing ---
    {
        "slug": "cashmere-overcoat", "name": "Cashmere Overcoat", "brand": "Olivia Dante", "category_slug": "clothing",
        "description": "Pure cashmere, tailored in Italy. A piece for a lifetime.",
        "specs": {"Material": "100% Cashmere", "Origin": "Italy"},
        "price": 1290.0, "stock": 9,
        "images": img("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["S", "M", "L", "XL"], "is_featured": True, "is_new": True, "tags": ["coat"]
    },
    {
        "slug": "merino-knit-crew", "name": "Merino Knit Crewneck", "brand": "Olivia Dante", "category_slug": "clothing",
        "description": "Fine-gauge Australian merino. Effortless layering.",
        "specs": {"Material": "100% Merino Wool", "Care": "Hand-wash cold"},
        "price": 245.0, "stock": 27,
        "images": img("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["S", "M", "L", "XL"], "is_best_seller": True, "tags": ["sweater"]
    },

    # --- Watches ---
    {
        "slug": "automatic-chrono-noir", "name": "Automatic Chronograph 'Noir'", "brand": "Olivia Dante", "category_slug": "watches",
        "description": "Swiss automatic movement, sapphire crystal, 42mm.",
        "specs": {"Movement": "Swiss Automatic", "Case": "316L Steel, 42mm", "Water-resistance": "100m"},
        "price": 1890.0, "stock": 7,
        "images": img("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["One Size"], "is_featured": True, "is_best_seller": True, "tags": ["swiss", "automatic"]
    },
    {
        "slug": "diver-pro-blue", "name": "Diver Pro 'Blue Lagoon'", "brand": "Olivia Dante", "category_slug": "watches",
        "description": "300m diver, ceramic bezel, screw-down crown.",
        "specs": {"Movement": "Swiss Automatic", "Case": "42mm Steel + Ceramic bezel", "WR": "300m"},
        "price": 1190.0, "stock": 14,
        "images": img("https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["One Size"], "is_new": True, "tags": ["diver"]
    },

    # --- Bags ---
    {
        "slug": "weekender-camel", "name": "Weekender 'Camel'", "brand": "Olivia Dante", "category_slug": "bags",
        "description": "Full-grain leather, brass fittings. Built for travel.",
        "specs": {"Material": "Full-grain leather", "Capacity": "38L"},
        "price": 690.0, "stock": 19,
        "images": img("https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["One Size"], "is_featured": True, "tags": ["travel"]
    },
    {
        "slug": "city-tote-noir", "name": "City Tote 'Noir'", "brand": "Olivia Dante", "category_slug": "bags",
        "description": "Pebbled leather day tote with brass hardware.",
        "specs": {"Material": "Pebbled leather"},
        "price": 490.0, "stock": 22,
        "images": img("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["One Size"], "tags": ["tote"]
    },

    # --- Art ---
    {
        "slug": "editorial-print-i", "name": "Editorial Print I", "brand": "Olivia Dante Gallery", "category_slug": "art",
        "description": "Limited-edition giclée print on 310gsm Hahnemühle paper. Signed and numbered.",
        "specs": {"Edition": "50", "Paper": "Hahnemühle 310gsm", "Size": "50x70cm"},
        "price": 380.0, "stock": 28,
        "images": img("https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["30x40cm", "50x70cm", "70x100cm"], "is_new": True, "tags": ["print"]
    },
    {
        "slug": "abstract-canvas-ii", "name": "Abstract Canvas II", "brand": "Olivia Dante Gallery", "category_slug": "art",
        "description": "Original acrylic on canvas. One-of-one.",
        "specs": {"Medium": "Acrylic on canvas", "Size": "80x100cm"},
        "price": 1800.0, "stock": 1,
        "images": img("https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["80x100cm"], "is_featured": True, "tags": ["original"]
    },

    # --- Furniture ---
    {
        "slug": "oak-dining-table", "name": "Solid Oak Dining Table", "brand": "Olivia Dante Maison", "category_slug": "furniture",
        "description": "Solid European oak. Tapered legs. Seats six.",
        "specs": {"Material": "European Oak", "Dimensions": "200 x 95 x 75 cm"},
        "price": 1990.0, "stock": 5,
        "images": img("https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["Six-seater", "Eight-seater"], "tags": ["oak", "table"]
    },
    {
        "slug": "lounge-chair-walnut", "name": "Lounge Chair 'Walnut'", "brand": "Olivia Dante Maison", "category_slug": "furniture",
        "description": "Walnut frame, full-grain leather sling.",
        "specs": {"Material": "Walnut + Leather"},
        "price": 1290.0, "stock": 8,
        "images": img("https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["One Size"], "is_new": True, "tags": ["chair"]
    },
    {
        "slug": "antique-armoire", "name": "Antique French Armoire", "brand": "Olivia Dante Maison", "category_slug": "furniture",
        "description": "19th-century French armoire in honey-toned oak.",
        "specs": {"Period": "19th c.", "Origin": "France"},
        "price": 4200.0, "stock": 2,
        "images": img("https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["One Of One"], "tags": ["antique"]
    },

    # --- Jewelry ---
    {
        "slug": "gold-chain-cuban-link", "name": "18K Cuban-Link Gold Chain", "brand": "Olivia Dante Atelier", "category_slug": "jewelry",
        "description": "18K yellow gold. Hand-finished Cuban link.",
        "specs": {"Material": "18K gold", "Length": "50cm / 55cm / 60cm", "Weight": "~32g"},
        "price": 2890.0, "stock": 6,
        "images": img("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["50cm", "55cm", "60cm"], "is_featured": True, "is_best_seller": True, "tags": ["gold"]
    },

    # --- Instruments ---
    {
        "slug": "baby-grand-piano", "name": "Baby Grand Piano 'Eclipse'", "brand": "Olivia Dante Maison", "category_slug": "instruments",
        "description": "Hand-finished ebony baby grand. Sourced from a Berlin workshop.",
        "specs": {"Finish": "Ebony", "Length": "152cm"},
        "price": 12800.0, "stock": 1,
        "images": img("https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=1200&q=80"),
        "sizes": ["One Of One"], "is_featured": True, "tags": ["piano"]
    },
]


REVIEWS = [
    {"product_slug": "iphone-17-pro-max", "author_name": "Marcus J.", "rating": 5, "title": "Best iPhone yet", "body": "Camera is unreal and titanium feels premium. Shipping was 36h with Olivia Dante."},
    {"product_slug": "air-jordan-1-retro", "author_name": "Lila K.", "rating": 5, "title": "Authenticity guaranteed", "body": "Exactly as described. Box, papers, perfect leather."},
    {"product_slug": "automatic-chrono-noir", "author_name": "Henry W.", "rating": 5, "title": "Worth every cent", "body": "Movement is whisper-smooth. Crown action is satisfying. Pure luxury."},
    {"product_slug": "cashmere-overcoat", "author_name": "Sofia P.", "rating": 5, "title": "Lifetime piece", "body": "Drapes beautifully. Customer service was outstanding."},
    {"product_slug": "weekender-camel", "author_name": "Dan R.", "rating": 5, "title": "Travel ready", "body": "Fits everything for a long weekend. Patina is forming nicely already."},
    {"product_slug": "gold-chain-cuban-link", "author_name": "Andre M.", "rating": 5, "title": "Solid 18K", "body": "Tested by my jeweler. Exactly as described. Crypto checkout was seamless."},
]

TESTIMONIALS = [
    {"name": "Adaeze N.", "role": "Lagos", "text": "Paid with USDT and received my watch in 3 days. Smoothest crypto checkout I've used."},
    {"name": "Lukas V.", "role": "Berlin", "text": "Provenance and packaging exceeded expectations. The 'Noir' chronograph is exquisite."},
    {"name": "Mei L.", "role": "Singapore", "text": "Olivia Dante feels like an old Parisian house. Modern checkout, classic taste."},
    {"name": "Jordan F.", "role": "New York", "text": "Bought the Cuban-link chain with BTC. Address generated instantly. Order confirmed in minutes."},
]

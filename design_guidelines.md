{
  "brand": {
    "name": "Olivia Dante Art Store",
    "attributes": [
      "premium",
      "aspirational",
      "editorial",
      "crypto-native trust",
      "minimal but warm",
      "high-contrast in both themes"
    ],
    "tone_voice": {
      "principles": [
        "Minimal, confident, specific (avoid hype)",
        "Short sentences. Strong nouns.",
        "Use product-first language: material, fit, condition, provenance",
        "Crypto copy should be reassuring and procedural (state machine language)"
      ],
      "example_microcopy": {
        "cta_primary": "Buy now",
        "cta_secondary": "Add to cart",
        "shipping_note": "Ships in 24–48h. Fully insured.",
        "payment_waiting": "Waiting for payment.",
        "payment_detected": "Payment detected. Confirming on-chain.",
        "payment_paid": "Paid. Preparing your order.",
        "payment_expired": "Payment window expired. Create a new payment request."
      }
    }
  },

  "typography": {
    "google_fonts": {
      "heading": {
        "family": "Fraunces",
        "weights": ["300", "400", "600"],
        "usage": "Brand + editorial headings (H1/H2), product titles on PDP"
      },
      "body": {
        "family": "Manrope",
        "weights": ["400", "500", "600", "700"],
        "usage": "UI body, nav, forms, tables, admin"
      },
      "mono": {
        "family": "IBM Plex Mono",
        "weights": ["400", "500"],
        "usage": "Wallet addresses, tx hashes, order IDs, countdown timer"
      },
      "import_snippet_css": "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');"
    },
    "text_size_hierarchy": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl",
      "h2": "text-base md:text-lg",
      "body": "text-sm md:text-base",
      "small": "text-xs"
    },
    "type_rules": [
      "Headings: Fraunces with tight tracking (tracking-[-0.02em])",
      "Body/UI: Manrope with normal tracking",
      "Numbers/addresses: IBM Plex Mono; add tracking-wide for addresses",
      "Avoid all-caps paragraphs; reserve uppercase for tiny labels (text-xs, tracking-[0.18em])"
    ]
  },

  "color_system": {
    "direction": "Luxury neutral base + warm bone surfaces + a restrained jade accent (no purple).",
    "palette_notes": [
      "No transparent backgrounds for text-heavy content.",
      "Gradients only as subtle section accents (<=20% viewport).",
      "Accent is jade/teal for crypto trust + premium feel; secondary accent is warm brass for luxury cues."
    ],
    "css_variables_app_css_paste_ready": "/* Olivia Dante — Design Tokens (paste into App.css or index.css @layer base) */\n:root {\n  /* Fonts */\n  --font-heading: 'Fraunces', ui-serif, Georgia, serif;\n  --font-body: 'Manrope', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;\n  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;\n\n  /* Core (HSL for shadcn compatibility) */\n  --background: 36 33% 97%;          /* bone */\n  --foreground: 222 22% 12%;         /* ink */\n\n  --card: 0 0% 100%;\n  --card-foreground: 222 22% 12%;\n\n  --popover: 0 0% 100%;\n  --popover-foreground: 222 22% 12%;\n\n  --primary: 222 22% 12%;            /* ink button */\n  --primary-foreground: 36 33% 97%;\n\n  --secondary: 36 20% 93%;           /* warm gray */\n  --secondary-foreground: 222 22% 12%;\n\n  --muted: 36 18% 92%;\n  --muted-foreground: 222 10% 40%;\n\n  --accent: 174 45% 34%;             /* jade */\n  --accent-foreground: 0 0% 100%;\n\n  --destructive: 0 72% 52%;\n  --destructive-foreground: 0 0% 100%;\n\n  --border: 30 12% 86%;\n  --input: 30 12% 86%;\n  --ring: 174 45% 34%;\n\n  /* Premium extras */\n  --surface-2: 36 22% 94%;\n  --surface-3: 36 18% 90%;\n  --brass: 38 52% 46%;               /* luxury accent (sparingly) */\n  --success: 160 55% 32%;\n  --warning: 38 92% 50%;\n  --info: 205 85% 45%;\n\n  /* Radius */\n  --radius: 0.75rem;                 /* 12px */\n  --radius-sm: 0.5rem;               /* 8px */\n  --radius-lg: 1rem;                 /* 16px */\n\n  /* Shadows (use via Tailwind arbitrary values) */\n  --shadow-sm: 0 1px 0 rgba(15, 23, 42, 0.06), 0 1px 8px rgba(15, 23, 42, 0.06);\n  --shadow-md: 0 2px 0 rgba(15, 23, 42, 0.08), 0 12px 30px rgba(15, 23, 42, 0.10);\n  --shadow-lg: 0 2px 0 rgba(15, 23, 42, 0.10), 0 24px 60px rgba(15, 23, 42, 0.14);\n}\n\n.dark {\n  --background: 222 22% 8%;          /* near-black ink */\n  --foreground: 36 33% 96%;          /* bone text */\n\n  --card: 222 22% 10%;\n  --card-foreground: 36 33% 96%;\n\n  --popover: 222 22% 10%;\n  --popover-foreground: 36 33% 96%;\n\n  --primary: 36 33% 96%;\n  --primary-foreground: 222 22% 10%;\n\n  --secondary: 222 16% 14%;\n  --secondary-foreground: 36 33% 96%;\n\n  --muted: 222 16% 14%;\n  --muted-foreground: 36 10% 72%;\n\n  --accent: 174 52% 40%;             /* brighter jade for dark */\n  --accent-foreground: 222 22% 10%;\n\n  --destructive: 0 62% 38%;\n  --destructive-foreground: 0 0% 100%;\n\n  --border: 222 14% 18%;\n  --input: 222 14% 18%;\n  --ring: 174 52% 40%;\n\n  --surface-2: 222 16% 12%;\n  --surface-3: 222 14% 16%;\n  --brass: 38 60% 56%;\n  --success: 160 55% 40%;\n  --warning: 38 92% 56%;\n  --info: 205 85% 55%;\n}\n\n/* Optional: subtle section accent gradient (<=20% viewport). Use only on hero background. */\n:root {\n  --hero-accent: radial-gradient(900px circle at 20% 10%, rgba(20, 184, 166, 0.10), transparent 55%),\n                 radial-gradient(700px circle at 80% 0%, rgba(184, 134, 11, 0.10), transparent 50%);\n}\n.dark {\n  --hero-accent: radial-gradient(900px circle at 20% 10%, rgba(20, 184, 166, 0.14), transparent 55%),\n                 radial-gradient(700px circle at 80% 0%, rgba(184, 134, 11, 0.10), transparent 50%);\n}\n",
    "tailwind_usage_notes": [
      "Use bg-background/text-foreground for page base.",
      "Use bg-card for cards; avoid opacity backgrounds for content.",
      "Use ring-[hsl(var(--ring))] for focus rings.",
      "Use text-muted-foreground for secondary copy."
    ]
  },

  "layout_spacing": {
    "grid": {
      "container": "max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8",
      "catalog_grid": "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4",
      "admin_grid": "grid gap-4 md:grid-cols-12",
      "pdp_grid": "grid gap-6 lg:grid-cols-12"
    },
    "spacing_scale_px": {
      "xs": 8,
      "sm": 12,
      "md": 16,
      "lg": 24,
      "xl": 32,
      "2xl": 48
    },
    "radius_scale": {
      "chip": "rounded-full",
      "card": "rounded-[var(--radius)]",
      "modal": "rounded-[var(--radius-lg)]"
    }
  },

  "component_path": {
    "shadcn_primary": {
      "button": "/app/frontend/src/components/ui/button.jsx",
      "card": "/app/frontend/src/components/ui/card.jsx",
      "input": "/app/frontend/src/components/ui/input.jsx",
      "select": "/app/frontend/src/components/ui/select.jsx",
      "dialog": "/app/frontend/src/components/ui/dialog.jsx",
      "sheet_drawer": "/app/frontend/src/components/ui/sheet.jsx",
      "tabs": "/app/frontend/src/components/ui/tabs.jsx",
      "accordion": "/app/frontend/src/components/ui/accordion.jsx",
      "badge": "/app/frontend/src/components/ui/badge.jsx",
      "table": "/app/frontend/src/components/ui/table.jsx",
      "progress": "/app/frontend/src/components/ui/progress.jsx",
      "separator": "/app/frontend/src/components/ui/separator.jsx",
      "scroll_area": "/app/frontend/src/components/ui/scroll-area.jsx",
      "switch": "/app/frontend/src/components/ui/switch.jsx",
      "calendar": "/app/frontend/src/components/ui/calendar.jsx",
      "sonner_toast": "/app/frontend/src/components/ui/sonner.jsx"
    }
  },

  "components": {
    "header_nav": {
      "layout": [
        "Sticky header with subtle border and solid background (no transparency).",
        "Left: Olivia Dante wordmark (Fraunces).",
        "Center (desktop): NavigationMenu for categories.",
        "Right: search, theme toggle, account, cart (cart opens Sheet drawer).",
        "Mobile: hamburger opens Sheet with categories + account links."
      ],
      "classes": {
        "header": "sticky top-0 z-50 bg-background/100 border-b border-border",
        "inner": "max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3",
        "wordmark": "font-[var(--font-heading)] text-lg tracking-[-0.02em]",
        "icon_button": "h-9 w-9 rounded-full hover:bg-secondary focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
      },
      "data_testids": {
        "theme_toggle": "theme-toggle",
        "cart_button": "header-cart-button",
        "search_button": "header-search-button",
        "account_button": "header-account-button"
      }
    },

    "hero_home": {
      "visual": [
        "Editorial split hero: left copy + CTA, right featured collage (2 stacked cards).",
        "Background uses --hero-accent (radial, subtle).",
        "Primary CTA: solid ink button; Secondary: outline with brass hover border."
      ],
      "classes": {
        "section": "relative overflow-hidden",
        "bg": "absolute inset-0 pointer-events-none [background:var(--hero-accent)]",
        "content": "relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14",
        "h1": "font-[var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] leading-[1.02]",
        "sub": "mt-4 text-sm md:text-base text-muted-foreground max-w-[52ch]",
        "cta_row": "mt-6 flex items-center gap-3"
      },
      "motion": {
        "pattern": "staggered reveal",
        "notes": "Use Framer Motion: container variants with staggerChildren=0.06; each line fades up y:12 -> 0"
      },
      "data_testids": {
        "primary_cta": "home-hero-primary-cta",
        "secondary_cta": "home-hero-secondary-cta"
      }
    },

    "product_card": {
      "image_ratio": "4:5 (fashion) and 1:1 (electronics) — keep consistent per category page",
      "structure": [
        "Card with image, brand/title, price row, rating, quick actions.",
        "Hover (desktop): image subtle zoom + quick actions slide in.",
        "Mobile: actions always visible below price (no hover dependency)."
      ],
      "classes": {
        "card": "group rounded-[var(--radius)] bg-card border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow",
        "media": "relative overflow-hidden rounded-[calc(var(--radius)-2px)]",
        "img": "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]",
        "meta": "p-3 sm:p-4",
        "title": "font-medium leading-snug",
        "price": "mt-1 font-semibold",
        "chips": "mt-2 flex flex-wrap gap-1"
      },
      "badges": {
        "new": "Badge variant=secondary",
        "low_stock": "Badge className='bg-[hsl(var(--warning))] text-black'",
        "sold_out": "Badge variant=outline + opacity-70"
      },
      "data_testids": {
        "card": "product-card",
        "add_to_cart": "product-card-add-to-cart",
        "buy_now": "product-card-buy-now"
      }
    },

    "product_detail_page": {
      "layout": [
        "12-col grid desktop: left 7 cols gallery, right 5 cols purchase panel.",
        "Gallery: main image + thumbnail rail (ScrollArea).",
        "Purchase panel is sticky on desktop (top offset below header).",
        "Below: Tabs for Description / Specs / Reviews."
      ],
      "classes": {
        "wrap": "max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6",
        "grid": "grid gap-6 lg:grid-cols-12",
        "gallery": "lg:col-span-7",
        "panel": "lg:col-span-5 lg:sticky lg:top-20",
        "panel_card": "rounded-[var(--radius)] bg-card border border-border shadow-[var(--shadow-sm)] p-4 sm:p-5"
      },
      "controls": {
        "size_selector": "RadioGroup with pill items",
        "qty": "Input + stepper buttons",
        "trust_row": "icons + short copy (insured shipping, authenticity, support)"
      },
      "data_testids": {
        "size_picker": "pdp-size-picker",
        "qty_input": "pdp-qty-input",
        "add_to_cart": "pdp-add-to-cart",
        "buy_now": "pdp-buy-now"
      }
    },

    "cart_drawer": {
      "component": "Sheet",
      "behavior": [
        "Opens from right; shows items, subtotal, checkout CTA.",
        "Use ScrollArea for item list.",
        "Sticky footer inside drawer with subtotal + CTA."
      ],
      "data_testids": {
        "drawer": "cart-drawer",
        "checkout": "cart-drawer-checkout-button"
      }
    },

    "checkout_stepper": {
      "steps": ["Cart", "Details", "Payment"],
      "ui": [
        "Top stepper: Tabs-like segmented control on desktop; Progress bar + labels on mobile.",
        "Each step is a Card with clear section headings.",
        "Payment step: method picker cards (Crypto / PayPal) with radio selection."
      ],
      "classes": {
        "stepper_wrap": "flex items-center justify-between gap-2",
        "step_chip": "rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase border",
        "active": "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent"
      },
      "data_testids": {
        "stepper": "checkout-stepper",
        "payment_method_crypto": "checkout-payment-method-crypto",
        "payment_method_paypal": "checkout-payment-method-paypal",
        "continue": "checkout-continue-button"
      }
    },

    "crypto_payment_page": {
      "layout": [
        "Desktop: 2 columns — left payment card (QR + address + status), right order summary + instructions.",
        "Mobile: stacked; keep Copy Address + Open Wallet as sticky bottom bar.",
        "Use mono font for address and amount.",
        "Status is a pill + step tracker (Awaiting → Detected → Confirming → Paid)."
      ],
      "status_colors": {
        "awaiting": "bg-secondary text-foreground",
        "detected": "bg-[hsl(var(--info))] text-white",
        "confirming": "bg-[hsl(var(--warning))] text-black",
        "paid": "bg-[hsl(var(--success))] text-white",
        "expired": "bg-muted text-muted-foreground border border-border"
      },
      "micro_interactions": [
        "Status pill: subtle pulse only for Awaiting/Confirming (opacity pulse, not scale).",
        "Copy button: on click, show sonner toast 'Copied'.",
        "Countdown: Progress component decreases; when <20%, switch to warning color."
      ],
      "data_testids": {
        "wallet_address": "payment-wallet-address",
        "copy_address": "payment-copy-address-button",
        "qr": "payment-qr-code",
        "amount": "payment-amount-due",
        "timer": "payment-countdown-timer",
        "status": "payment-status-pill"
      }
    },

    "admin_layout": {
      "layout": [
        "Left sidebar (collapsible) + main content.",
        "Use Card widgets for analytics; Table for lists.",
        "Admin uses slightly denser spacing but same tokens."
      ],
      "classes": {
        "shell": "min-h-screen bg-background",
        "grid": "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid gap-6 lg:grid-cols-[260px_1fr]",
        "sidebar": "rounded-[var(--radius)] bg-card border border-border shadow-[var(--shadow-sm)] p-3",
        "nav_item": "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary",
        "active": "bg-secondary font-semibold"
      },
      "widgets": {
        "kpi_card": "Card + big number + delta badge",
        "charts": "Recharts (optional) with muted gridlines and mono tick labels"
      },
      "data_testids": {
        "sidebar": "admin-sidebar",
        "products_table": "admin-products-table",
        "orders_table": "admin-orders-table"
      }
    }
  },

  "motion": {
    "library": "framer-motion",
    "principles": [
      "Fast, restrained, premium (no bouncy overshoot).",
      "Prefer opacity + y translation; avoid large rotations.",
      "Respect prefers-reduced-motion."
    ],
    "tokens": {
      "ease": "[0.22, 1, 0.36, 1]",
      "fast": 0.18,
      "base": 0.28,
      "slow": 0.42
    },
    "patterns": {
      "hover_lift": {
        "use": "Product cards, CTA buttons",
        "spec": "whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: [0.22,1,0.36,1] }}"
      },
      "fade_in_on_scroll": {
        "use": "Homepage sections",
        "spec": "initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}"
      },
      "stagger_reveal": {
        "use": "Product grids, testimonial lists",
        "spec": "container: staggerChildren 0.06; child: opacity 0->1, y 10->0"
      },
      "status_pill_pulse": {
        "use": "Payment Awaiting/Confirming",
        "spec": "animate={{ opacity: [1, 0.72, 1] }} transition={{ duration: 1.2, repeat: Infinity }}"
      }
    }
  },

  "iconography": {
    "library": "lucide-react",
    "rules": [
      "Use 1.5px stroke for most icons (default).",
      "Keep icons in 16/18/20 sizes; avoid mixing sizes in same row.",
      "Use icons as functional affordances, not decoration.",
      "For crypto networks, prefer simple text badges (BTC/ETH/USDT) over random icons unless you have official SVGs."
    ],
    "recommended_icons": {
      "cart": "ShoppingBag",
      "search": "Search",
      "theme": "Sun/Moon",
      "user": "User",
      "payment": "Wallet",
      "copy": "Copy",
      "timer": "Timer",
      "status": "BadgeCheck / LoaderCircle / AlertTriangle"
    }
  },

  "imagery": {
    "note": "Image selector tool is unavailable in this environment; use these sourcing rules and placeholders until assets are added.",
    "image_urls": {
      "hero": [
        {
          "category": "hero",
          "description": "Editorial collage: fashion + electronics + art object. Use 2 images with consistent lighting.",
          "url": "https://images.unsplash.com/photo-1520975958225-1f3b3c6f1f2a?auto=format&fit=crop&w=1600&q=80"
        }
      ],
      "product_placeholders": [
        {
          "category": "product",
          "description": "Minimal studio product placeholder (swap per category).",
          "url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
        }
      ],
      "art_gallery": [
        {
          "category": "editorial",
          "description": "Gallery interior for homepage editorial section.",
          "url": "https://images.unsplash.com/photo-1520697222865-7b3f2f1b7b1a?auto=format&fit=crop&w=1600&q=80"
        }
      ]
    },
    "styling": {
      "product_card": {
        "ratio": "aspect-[4/5] (fashion) or aspect-square (electronics)",
        "treatment": "No heavy filters. Slight contrast. Keep background neutral.",
        "hover": "scale 1.03 on desktop only"
      },
      "pdp_gallery": {
        "main": "aspect-[4/5] rounded-[var(--radius)] border",
        "thumbs": "aspect-square rounded-md border hover:border-[hsl(var(--accent))]"
      }
    }
  },

  "libraries": {
    "required": [
      {
        "name": "framer-motion",
        "why": "Premium micro-interactions and section reveals",
        "install": "npm i framer-motion"
      }
    ],
    "optional": [
      {
        "name": "recharts",
        "why": "Admin analytics charts",
        "install": "npm i recharts",
        "usage_notes": "Use muted gridlines (stroke hsl(var(--border))) and mono ticks (font-family var(--font-mono))."
      }
    ]
  },

  "accessibility": {
    "requirements": [
      "WCAG AA contrast in both themes.",
      "Visible focus rings: focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2",
      "Touch targets >= 44px on mobile.",
      "Respect prefers-reduced-motion: disable non-essential animations.",
      "Never rely on color alone for payment status; include icon + label."
    ]
  },

  "instructions_to_main_agent": {
    "global": [
      "Remove default CRA App.css centering/header styles; replace with token-based styling.",
      "Add Google Fonts import to index.css (top) or in public/index.html.",
      "Use CSS variables above to override shadcn tokens (background/foreground/etc).",
      "Ensure every interactive element and key info has data-testid (kebab-case).",
      "Use shadcn components for all UI primitives (no raw HTML dropdowns/calendars/toasts)."
    ],
    "page_specific": [
      "Crypto payment page must feel like a live state machine: status pill + step tracker + countdown + QR + copy.",
      "Catalog filters: use Sheet on mobile, left sidebar on desktop.",
      "Admin: keep dense but readable; tables with sticky header and row hover."
    ]
  },

  "appendix_general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}

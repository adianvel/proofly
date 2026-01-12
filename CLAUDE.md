{
  "project_name": "Proofly - Full Layout Specification",
  "base_style": "Scroll.io Minimalist (Neo-Brutalism Light)",
  "global_settings": {
    "bg_color": "#FDFCF6",
    "primary_red": "#FF4D4D",
    "text_dark": "#1A1A1A",
    "container_max_width": "1280px",
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "navbar": {
      "style": "Sticky, transparent with slight blur on scroll",
      "elements": {
        "left": "Logo 'Proofly' in Bold Sans-serif with a small red document icon",
        "center": ["Create", "My Receipts", "Explorer", "Docs"],
        "right": "Connect Wallet Button (Pill-shaped, Red background, White text, bold)"
      },
      "padding": "1.5rem 2rem"
    },
    "hero_section": {
      "layout": "2-column grid (60:40 split)",
      "left_content": {
        "headline": "Make Blockchain Transactions Human-Readable.",
        "description": "Stop sharing confusing hashes. Turn your Base transactions into beautiful, shareable Prooflys in seconds.",
        "cta_group": [
          { "label": "Create New Receipt", "style": "Primary Red with Arrow Icon" },
          { "label": "How it works", "style": "Outline Black" }
        ]
      },
      "right_content": "Isometric 3D illustration of a floating receipt being validated by a blockchain node, using the Scroll-style line art and soft shadows"
    },
    "main_content_layout": {
      "section_spacing": "120px top/bottom",
      "feature_grid": {
        "title": "Why Proofly?",
        "cards": [
          { "title": "Immutable Context", "desc": "Attach titles and notes that stay onchain forever.", "icon": "ShieldCheck" },
          { "title": "Human-Centric", "desc": "Designed for non-technical users to understand 'why' a tx happened.", "icon": "UserGroup" },
          { "title": "One-Click Share", "desc": "Public URLs that anyone can view without a wallet.", "icon": "Share" }
        ]
      }
    },
    "receipt_preview_component": {
      "style": "A centered card that looks like a physical paper receipt with jagged edges at the bottom, placed over the cream background",
      "fields": ["Transaction ID", "Recipient", "Amount in ETH", "Date/Time", "Custom Note"]
    },
    "footer": {
      "style": "Clean, multi-column with top border",
      "columns": [
        { "header": "Product", "links": ["Create", "History", "Verification"] },
        { "header": "Ecosystem", "links": ["Base", "Coinbase Wallet", "Farcaster"] },
        { "header": "Resources", "links": ["Github", "Docs", "Security"] }
      ],
      "bottom_bar": {
        "left": "© 2025 Proofly",
        "right": ["Twitter", "Discord", "Github icons"]
      }
    }
  }
}
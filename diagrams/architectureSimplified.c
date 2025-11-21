---
config:
  layout: elk
---
flowchart LR
 subgraph EXTERNAL_APIS["🌍 External APIs / Third-Party Services"]
    direction TB
        GP["Google Places API\n(fetches raw POI data)"]
        IG_API["Instagram API\n(reads pages → returns posts, media, metadata)"]
        OFM["OpenFreeMap Library\n(interactive map tiles & layers)"]
  end
 subgraph INTERNAL_BE["Background Workers / Internal Services\n(not called directly by the app)"]
    direction TB
        W_GP["Google Places Worker\n(fetches → writes raw POI data into DB)"]
        W_IG["Instagram Scraper Worker\n(reads DB list → fetches IG → writes into DB)"]
        W_TXT["Text Analyzer Worker\n(reads IG posts → extracts keywords → updates DB)"]
        W_EVT["Events Scraper Worker\n(scrapes Sympla / event sites → outputs raw events)"]
        W_EVT_PIPE["Events Processing Worker\n(polishes data → writes final entries into DB)"]
  end
 subgraph AWS["☁️ AWS Cloud (Everything we own lives here)"]
    direction TB
        FE["Application Front-End\n(.com.br domain)"]
        BE_MAIN["Main Application Backend\n(core API used by the App)"]
        INTERNAL_BE
  end
    GP --> W_GP
    W_GP --> DB["Supabase\n(PostgreSQL database hosting all project tables)"]
    DB --> W_IG & W_TXT
    W_IG --> IG_API & DB
    IG_API --> W_IG
    W_TXT --> DB
    W_EVT --> W_EVT_PIPE
    W_EVT_PIPE --> DB
    FE --> BE_MAIN
    BE_MAIN --> DB & OFM
     GP:::ext
     IG_API:::ext
     OFM:::ext
     W_GP:::service
     W_IG:::service
     W_TXT:::service
     W_EVT:::service
     W_EVT_PIPE:::service
     FE:::frontend
     BE_MAIN:::aws
     DB:::db
    classDef aws fill:#f2f0ff,stroke:#6b4eff,color:#1e104e,stroke-width:2px
    classDef db fill:#e4fff7,stroke:#1fa37a,color:#003826,stroke-width:2px
    classDef ext fill:#fff2e6,stroke:#ff8c00,color:#5a2d00,stroke-width:2px
    classDef service fill:#e9f1ff,stroke:#3d7eff,color:#0a2b70,stroke-width:2px
    classDef frontend fill:#ffe6f7,stroke:#cc4fa3,color:#4d0035,stroke-width:2px

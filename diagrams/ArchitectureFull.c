---
config:
  layout: elk
---
flowchart LR
 subgraph WORKERS["Fargate Workers (Scrapers & Processors)"]
        W_IG_SCRAPER["Instagram Scraper Worker<br>Reads: ig_target_accounts<br>Writes: ig_posts_raw"]
        W_IG_PROC["Instagram Processor<br>Normalizes &amp; keeps last 6<br>Writes: ig_posts_processed"]
        W_PLACES_RAW["Google Places Importer<br>Writes raw_places"]
        W_PLACES_PROCESS["Places Refiner<br>Writes poi_refined"]
        W_TEXT["Text Analyzer<br>Captions → Keywords"]
        W_OCR["OCR Worker (future)"]
        W_EVENTS_SCRAPER["Event Sites Scraper<br>(Sympla + 5 others)<br>Writes: events_raw"]
        W_EVENTS_CLEAN["Event Cleaner"]
        W_EVENTS_POLISH["Event Polisher<br>Writes: events_final"]
  end
 subgraph AWS["☁️ AWS CLOUD (All non-third-party components)"]
        FE["Frontend (.com.br domain)<br>React App<br>Hosted in AWS"]
        API["Main Backend API<br>AWS Lambda + API Gateway"]
        WORKERS
        CACHE["Redis (Elasticache)<br>Caching + rate-limiting"]
        SCHED["EventBridge Cron<br>Triggers workers &amp; batches"]
  end
 subgraph DB["🟢 Supabase (Postgres + Edge Functions)"]
        T_IG_TARGET["ig_target_accounts"]
        T_IG_RAW["ig_posts_raw"]
        T_IG_PROCESSED["ig_posts_processed"]
        T_PLACES_RAW["raw_places"]
        T_PLACES_REFINED["poi_refined"]
        T_PLACES_CAT["poi_categories"]
        T_PLACES_KW["poi_keywords"]
        T_EVENTS_RAW["events_raw"]
        T_EVENTS_CLEAN["events_clean"]
        T_EVENTS_FINAL["events_final"]
        T_REGIONS["regions"]
        T_LOGS["ingestion_logs"]
        T_OCR["ocr_text"]
  end
    FE --> API
    API --> CACHE & DB
    CACHE --> API
    T_IG_TARGET --> W_IG_SCRAPER
    IG_API["Instagram API"] --> W_IG_SCRAPER
    W_IG_SCRAPER --> T_IG_RAW
    W_IG_PROC --> T_IG_PROCESSED
    T_IG_RAW --> W_IG_PROC
    W_TEXT --> T_PLACES_KW
    T_IG_PROCESSED --> W_TEXT
    GP_API["Google Places API"] --> W_PLACES_RAW
    W_PLACES_RAW --> T_PLACES_RAW
    T_PLACES_RAW --> W_PLACES_PROCESS
    W_PLACES_PROCESS --> T_PLACES_REFINED
    EVENTS_EXT["External Event Sites (6 total)"] --> W_EVENTS_SCRAPER
    W_EVENTS_SCRAPER --> T_EVENTS_RAW
    T_EVENTS_RAW --> W_EVENTS_CLEAN
    W_EVENTS_CLEAN --> T_EVENTS_CLEAN
    T_EVENTS_CLEAN --> W_EVENTS_POLISH
    W_EVENTS_POLISH --> T_EVENTS_FINAL
    W_OCR --> T_OCR
    SCHED --> W_IG_SCRAPER & W_IG_PROC & W_PLACES_RAW & W_PLACES_PROCESS & W_EVENTS_SCRAPER & W_EVENTS_CLEAN & W_EVENTS_POLISH
     FE:::frontend
     API:::aws
     W_IG_SCRAPER:::worker
     W_IG_PROC:::worker
     W_PLACES_RAW:::worker
     W_PLACES_PROCESS:::worker
     W_TEXT:::isolated
     W_OCR:::isolated
     W_EVENTS_SCRAPER:::worker
     W_EVENTS_CLEAN:::worker
     W_EVENTS_POLISH:::worker
     CACHE:::redis
     SCHED:::aws
     IG_API:::api
     GP_API:::google
     EVENTS_EXT:::events
     T_IG_TARGET:::supabase
     T_IG_RAW:::supabase
     T_IG_PROCESSED:::supabase
     T_PLACES_RAW:::supabase
     T_PLACES_REFINED:::supabase
     T_PLACES_CAT:::supabase
     T_PLACES_KW:::supabase
     T_EVENTS_RAW:::supabase
     T_EVENTS_CLEAN:::supabase
     T_EVENTS_FINAL:::supabase
     T_REGIONS:::supabase
     T_LOGS:::supabase
     T_OCR:::supabase
    classDef aws fill:#f9e79f,stroke:#b7950b,stroke-width:2,color:#000
    classDef api fill:#d2b4de,stroke:#7d3c98,stroke-width:2,color:#000
    classDef google fill:#aed6f1,stroke:#2874a6,stroke-width:2,color:#000
    classDef events fill:#a2d9ce,stroke:#117a65,stroke-width:2,color:#000
    classDef supabase fill:#abebc6,stroke:#1d8348,stroke-width:2,color:#000
    classDef frontend fill:#f5b7b1,stroke:#c0392b,stroke-width:2,color:#000
    classDef worker fill:#d5d8dc,stroke:#626567,stroke-width:1,color:#000
    classDef redis fill:#f1948a,stroke:#cb4335,stroke-width:2,color:#000
    classDef isolated fill:#bfc9ca,stroke:#424949,stroke-width:1,color:#000

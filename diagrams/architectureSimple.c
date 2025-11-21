---
config:
  layout: elk
---
flowchart LR
    FE["Frontend<br>(React App)"] --> API["Backend API (Lambda)"]
    API --> DB["Supabase"] & CACHE["Redis"]
    GP_API["Google Places API"] --> W1["Fargate Workers"]
    W1 --> DB
    IG_API["Instagram API"] --> W2["IG Workers"]
    W2 --> DB
    EVENTS["Event Sites"] --> W3["Event Workers"]
    W3 --> DB
    scheduler["EventBridge Cron"] --> W1 & W2 & W3
     FE:::frontend
     API:::aws
     DB:::supabase
     CACHE:::redis
     GP_API:::google
     W1:::aws
     IG_API:::api
     W2:::aws
     EVENTS:::events
     W3:::aws
     scheduler:::aws
    classDef aws fill:#f9e79f,stroke:#b7950b
    classDef api fill:#d2b4de,stroke:#7d3c98
    classDef google fill:#aed6f1,stroke:#2874a6
    classDef events fill:#a2d9ce,stroke:#117a65
    classDef supabase fill:#abebc6,stroke:#1d8348
    classDef frontend fill:#f5b7b1,stroke:#c0392b
    classDef redis fill:#f1948a,stroke:#cb4335

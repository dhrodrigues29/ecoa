---
config:
  layout: dagre
---
flowchart TD
 subgraph USER["👤 USER (future partner)"]
        P0["Clicks Become a Partner"]
        P1["Types identifier\n(IG @, CNPJ, POI name)"]
        P2["Types preferred contact e-mail"]
        P3["Selects POI from list"]
        P4["Clicks See it on map (mock)"]
        P5["Closes mock modal"]
        P6["Clicks a plan card"]
        P7["Clicks See with perks (mock)"]
        P8["Closes mock modal"]
        P9["Clicks Choose payment method"]
        P10["Selects Credit-card tab"]
        P11["Fills card form"]
        P12["Clicks Confirm payment"]
        P13["Clicks See my POI\nafter success badge"]
        P14["Closes browser / tab"]
  end
 subgraph SYS["⚙️ SYSTEM"]
        S0["Shows Partner identifier screen"]
        S1["Search DB + Google Places"]
        S2["Display POI list\n(or ‘Register new POI’ button)"]
        S3["Highlight selected POI"]
        S4["Open modal with mocked\nboosted POI preview"]
        S5["Store chosen plan\n(hard-coded)"]
        S6["Generate mocked boosted view"]
        S7["Open payment screen\n(pre-select Credit card)"]
        S8["Show read-only success badge"]
        S9["Activate real boosted flag\nfor that POI"]
        S10["Navigate to real map\nwith POI opened & boosted"]
        S11["Send confirmation e-mail"]
  end
 subgraph EXT["🌐 EXTERNAL"]
        G0["Google Places API"]
        G1["Stripe (mock)"]
        G2["SendGrid / e-mail service"]
  end
    START(["*"]) --> LAND["Accesses ecoa.app URL"]
    LAND --> P0
    P0 --> S0
    S0 --> P1
    P1 --> S1
    S1 --> G0
    G0 --> S2
    S2 --> P2 & P3
    P2 --> S2
    P3 --> S3
    S3 --> P4
    P4 --> S4
    S4 --> P5 & P8
    P5 --> P6
    P6 --> S5
    S5 --> P7
    P7 --> S6
    S6 --> S4
    P8 --> P9
    P9 --> S7
    S7 --> P10
    P10 --> P11
    P11 --> P12
    P12 --> S8
    S8 --> P13 & S11
    P13 --> S9
    S9 --> S10
    S10 --> P14
    S11 --> G2
    P14 --> END(["*"])
     END:::endNode
    classDef endNode fill:#f96,stroke:#333,stroke-width:2px

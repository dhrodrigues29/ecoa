---
config:
  layout: elk
---
flowchart TD
 subgraph USER["👤 USER"]
        P0["Clicks Become a Partner"]
        P1["Types identifier\n(IG @, CNPJ, POI name)"]
        P2["Types preferred e-mail\nfor contact"]
        P3["Clicks a POI from list"]
        P4["Clicks See it on map (mock)"]
        P5["Clicks Select Plan card"]
        P6["Clicks See with perks (mock)"]
        P7["Clicks Choose payment method"]
        P8["Sees Confirm payment screen"]
        P9["Selects Credit-card tab"]
        P10["Fills card form"]
        P11["Clicks Confirm (read-only)"]
        P12["Clicks See my POI"]
        P13["Clicks Back (any screen)"]
        P14["Clicks Register new POI\n(if list empty)"]
  end
 subgraph SYS["⚙️ SYSTEM"]
        S0["Shows Partner identifier screen"]
        S1["Searches DB + Google Places"]
        S2["Displays POI list"]
        S3["Higlights selected POI"]
        S4["Opens modal with mocked\nboosted POI preview"]
        S5["Shows hard-coded plan cards"]
        S6["Stores selected plan"]
        S7["Opens payment screen\n(pre-select Credit card)"]
        S8["Displays static success badge"]
        S9["Activates POI as real boosted\n(session upgrade)"]
        S10["Navigates to real map\nwith boosted POI opened"]
        S11["Handles Back navigation\n(via React Router stack)"]
  end
 subgraph EXT["🌐 EXTERNAL"]
        G0["Google Places API"]
        G1["Stripe (mock calls)"]
  end
    START(["*"]) --> LAND["Landing page loaded\n(search bar + Partner button)"]
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
    S4 --> P5 & P7
    P5 --> S5
    S5 --> S6
    S6 --> P6
    P6 --> S4
    P7 --> S7
    S7 --> P8
    P8 --> P9
    P9 --> P10
    P10 --> P11
    P11 --> S8
    S8 --> P12 & END(["*"])
    P12 --> S9
    S9 --> S10
    S10 --> P13
    P13 -.-> S11
    S11 -.-> S0
    S2 -- no results --> P14
    P14 --> S1
     END:::endNode
    classDef endNode fill:#f96,stroke:#333,stroke-width:2px

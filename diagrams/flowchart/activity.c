---
config:
  layout: fixed
---
flowchart TD
 subgraph USER_LANE["👤 USER"]
    direction TB
        A1["Accesses ecoa.app URL"]
        A0(["*"])
        A2["Clicks Partner (optional)"]
        A3["Enters text in universal search bar\n(CEP, city, keyword, POI name)"]
        A4["Press Enter or clicks 🔍"]
        A5["Views map screen"]
        A6["Clicks Destaques tag\nto toggle highlights"]
        A7["Clicks a POI marker"]
        A8["Clicks external link\n(IG or website)"]
        A9["Clicks next/previous\nin POI carousel"]
        A10["Clicks X to close POI card"]
        A11["Drags / zooms map"]
        A12["Clicks tag-bar filters\n(non-location)"]
        A13["Clicks location-category tag"]
        A14["Clicks Advanced Search button"]
        A15["Selects / unselects tags\ninside modal"]
        A16["Clicks Apply"]
        A17["Clicks Cancel\n(clears selection)"]
        A18["Clicks X\n(keeps selection)"]
        A19["Closes browser / tab"]
  end
 subgraph SYS_LANE["⚙️ SYSTEM"]
    direction TB
        S1["Renders landing page\n(search bar + Partner button)"]
        S2["Renders Partner login / plans\n(OUT-OF-SCOPE detail)"]
        S3["Detects location from text\nor sets default (Porto Alegre centre)"]
        S4["Calls /search endpoint\nwith viewport + Destaques=true"]
        S5["Returns POIs + posts\n& nextCursor"]
        S6["Caches results 60 s"]
        S7["Flies map to new centre\n(only if location tag chosen)"]
        S8["Auto-applies tag filter\n& re-queries"]
        S9["Opens POI detail card\n(carousel state)"]
        S10["Opens external URL\nin new tab / app"]
        S11["Maintains session state\n(5-min timeout)"]
        S12["Re-queries with new tag mask"]
        S13["Shows Advanced Search modal"]
        S14["Builds combined tag filter"]
        S15["Re-queries & updates map"]
        S16["Shows pop-up\n“No POI found”"]
  end
 subgraph EXT_LANE["🌐 EXTERNAL"]
    direction TB
        E1["Google Maps JS\npans & places markers"]
        E2["Instagram Basic Display\n(posts, images)"]
        E3["Google Places API\n(placeId, address)"]
  end
    A0 --> A1
    A1 --> S1
    S1 --> A2
    A2 -- No --> A3
    A2 -- Yes --> S2
    S2 --> A3
    A3 --> A4
    A4 --> S3
    S3 --> S4
    S4 --> S5
    S5 --> S6
    S6 --> A5
    A5 --> A6 & A7 & A11 & A12 & A13 & A14 & A19
    A6 -- toggle OFF --> S4
    A6 -- toggle ON --> S4
    A7 --> S9
    S9 --> A8 & A9 & A10
    A8 --> S10
    S10 --> E2 & E3
    A9 --> S9
    A10 --> A5
    A11 --> E1
    A12 --> S12
    S12 --> S4
    A13 --> S7
    S7 --> E1 & S4
    A14 --> S13
    S13 --> A15
    A15 --> A16 & A17 & A18
    A16 --> S14
    S14 --> S15 & S15
    S15 --> A5 & A5
    A17 --> S14
    A18 --> A5
    S4 -- 0 results --> S16
    S16 --> A5
    A19 --> END(["*"])

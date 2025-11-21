---
config:
  layout: dagre
---
flowchart TD
    START(["*"]) --> LAND["Landing page\n(search bar visible)"]
    LAND --> SEARCH["User types/universal search\n(CEP, city, keyword, POI name)"]
    SEARCH --> ENTER["Press Enter or click 🔍"]
    ENTER --> SYS_LOC["System sets default location\nif not implicit"]
    SYS_LOC --> LOAD_MAP["Load map screen\nauto-show Destaques POIs"]
    LOAD_MAP --> MAP_SCR["Map screen loop"]
    MAP_SCR --> CLICK_POI["Click POI marker"] & DRAG["Drag / zoom map"] & TAG_FILT["Click tag-bar filters\n(non-location)"] & LOC_TAG["Click location-category tag"] & ADV["Click Advanced Search"] & HOME["Back to Home"] & END_NODE(["*"])
    CLICK_POI --> CARD["Open POI detail card\n(carousel, external link, X)"]
    CARD --> EXT["Open external link\n(IG / website)"] & NEXT["Next / Prev POI"] & CLOSE["Close card (X)"]
    EXT --> MAP_SCR
    NEXT --> CARD
    CLOSE --> MAP_SCR
    TAG_FILT --> RE_Q["Re-query & update map"]
    RE_Q --> MAP_SCR
    LOC_TAG --> FLY["Fly & centre map"]
    FLY --> MAP_SCR
    ADV --> MODAL["Advanced Search modal"]
    MODAL --> APPLY["Click Apply"] & CANC["Click Cancel\n(clears selection)"] & X_BTN["Click X\n(keeps selection)"]
    APPLY --> COMB["Combine tags & search"]
    COMB --> MAP_SCR
    CANC --> MAP_SCR
    X_BTN --> MAP_SCR
    RE_Q -- 0 results --> POP["Pop-up: No POI found"]
    POP --> MAP_SCR
    HOME --> LAND

---
config:
  layout: dagre
---
flowchart TD

A0["Access Project URL"]

%% =======================
%% HOME SCREEN
%% =======================
subgraph HOME["🏠 HOME SCREEN"]
    H1["Display: Search Bar, Enter Button, Become Partner Button"]

    %% Branch 1 – Click Enter
    H1 -->|Click Enter| H_ENTER["Go to Map Screen(carry: SearchQuery|null)"]

    %% Branch 2 – Click Search Bar
    H1 -->|Click Search Bar| H_SB1["Typing... Suggestions shown"]
    H_SB1 --> H_SB2["Click suggestion OR press Enter"]
    H_SB2 --> H_SB3["Go to Map Screen(carry: SearchQuery)"]

    %% Branch 3 – Click Become Partner
    H1 -->|Click Become Partner| H_BP["Go to Partner Screen"]
end

A0 --> H1

%% =======================
%% PARTNER SCREEN
%% =======================
subgraph PARTNER["🤝 PARTNER SCREEN"]
    P1["Display: Search Bars, Instagram Input, Contact Input, Plan Buttons"]

    P1 -->|All inputs filled + Plan selected| P_READY["Continue to Payment enabled See It On Map visible"]

    %% Continue to Payment
    P_READY -->|Click Continue to Payment| P_PAY["Go to Confirm Payment Screen (carry: PartnerInfo)"]

    %% See it on map
    P_READY -->|Click See It On Map| P_MAP_PRE["Go to Map Screen (Preview Mode) (carry: PartnerInfo)"]

    %% Click Back
    P1 -->|Click Back| P_BACK["Return to Home Screen (retain state)"]
end

H_BP --> P1

%% =======================
%% CONFIRM PAYMENT SCREEN
%% =======================
subgraph PAYMENT["💳 CONFIRM PAYMENT SCREEN"]
    C0["Tabs visible: Credit, Pix, Boleto"]

    %% Credit
    C0 -->|Credit Tab| C_C1["Fill card info"]
    C_C1 --> C_C2["Confirm Payment"]
    C_C2 --> C_POP1["Popup: Payment Confirmed, Thank You!"]
    C_POP1 --> C_HOME1["Go to Home Screen"]

    %% Pix
    C0 -->|Pix Tab| C_P1["Copy QR Code → Confirm Payment"]
    C_P1 --> C_P2["Popup: Payment Confirmed, Thank You!"]
    C_P2 --> C_HOME2["Go to Home Screen"]

    %% Boleto
    C0 -->|Boleto Tab| C_B1["Download/Copy boleto → Confirm Payment"]
    C_B1 --> C_B2["Popup: Payment Confirmed, Thank You!"]
    C_B2 --> C_HOME3["Go to Home Screen"]

    %% Back
    C0 -->|Back| C_BACK["Return to Partner Screen (retain state)"]
end

P_PAY --> C0

%% =======================
%% MAP SCREEN
%% =======================
subgraph MAP["🗺️ MAP SCREEN"]
    M0["Visible: Map, Search, Tags, POIs, Zoom, Advanced Search"]

    %% Search
    M0 -->|Search| M_S1["Type → Suggestion → Enter"]
    M_S1 --> M_S2["Show POIs (carry: SearchQuery)"]

    %% Invalid search
    M0 -->|Invalid Search| M_ERR["Popup: No Matches"]

    %% Advanced Search
    M0 -->|Click Advanced Search| M_A1["Open Advanced Search Window"]
    M_A1 -->|Click Search| M_A2["Return to Map with Filter (carry: SelectedTags)"]
    M_A1 -->|Cancel| M_A3["Reset filters"]
    M_A1 -->|X| M_A4["Close window (retain selections)"]

    %% Click POI
    M0 -->|Click POI Marker| M_POI["Open POI Full Card"]

    %% Back
    M0 -->|Back| M_BACK["Return to Home Screen (retain state)"]
end

H_ENTER --> M0
H_SB3 --> M0
P_MAP_PRE --> M0

%% =======================
%% POI FULL CARD
%% =======================
subgraph POICARD["📄 POI FULL CARD"]
    PC1["Display POI Info"]
    PC1 -->|Click X| PC_BACK["Return to Map Screen"]
end

M_POI --> PC1
PC_BACK --> M0

%% =======================
%% RETURNS + ENDS
%% =======================
P_BACK --> H1
C_BACK --> P1
C_HOME1 --> END(["*"])
C_HOME2 --> END
C_HOME3 --> END
M_BACK --> H1

END:::endNode
classDef endNode fill:#f96,stroke:#333,stroke-width:2px

---
config:
  theme: redux
---
flowchart TD
    %% Actors as round-socket nodes
    User(["User"])
    Business(["Business"])
    Admin(["Admin"])
    IG["Instagram API"]
    GG["Google Maps API"]

    %% Use-cases as rectangular tasks
    UC1["Search Events"]
    UC2["View POI Details"]
    UC3["Filter by Category"]
    UC4["Register Business"]
    UC5["Purchase Boost"]
    UC6["Cancel Subscription"]
    UC7["Fetch Hashtag Posts"]
    UC8["Resolve Place ID"]
    UC9["Approve / Reject Business"]
    UC10["View Analytics Dashboard"]
    UC11["Remove Flagged Content"]

    %% Sub-system clusters (optional visual grouping)
    subgraph Frontend_Discovery
        UC1
        UC2
        UC3
    end

    subgraph Frontend_Business
        UC4
        UC5
        UC6
    end

    subgraph Backend_Ingestion
        UC7
        UC8
    end

    subgraph Admin_Dashboard
        UC9
        UC10
        UC11
    end
   
   %% Main associations
    User --> UC1
    User --> UC2
    UC3 -. extend relation .-> UC1;
    Business --> UC4
    Business --> UC5
    UC4 -. include relation .-> UC5;
    Business --> UC6
    IG --> UC7
    GG --> UC8
    UC7 -. uses .-> UC8;
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11

    %% Cross-subsystem helpers
    UC8 -. supports .-> UC2;
    UC10 -. notifies .-> Business;
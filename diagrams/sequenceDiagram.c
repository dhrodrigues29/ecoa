sequenceDiagram
    actor User
    participant React
    participant Node
    participant PostgreSQL
    participant "Google Maps API" as GG
    participant "Instagram API" as IG
    participant Redis
    participant S3
    participant Cron
    actor Admin
    actor Business

    %% UC1: Search Events
    rect rgb(240,240,240)
    note over User,GG: UC1 – Search Events
    User->>React: type "festa sexta" + tap Search
    React->>Node: GET /search?q=festa+sexta&cursor=""
    activate Node
    Node->>PostgreSQL: SELECT pois JOIN posts … LIMIT 20
    PostgreSQL-->>Node: rows [poi, posts…]
    Node->>Redis: cache results 60 s
    Node-->>React: 200 {pois[], nextCursor}
    deactivate Node
    React->>GG: panToBounds, place markers
    alt 429 from Google Places
       Node-->>React: 503 {error: "maps_quota"}
       React->>User: toast "Map indisponível"
    end
    loop next page
       User->>React: scroll to bottom
       React->>Node: GET /search?cursor=eyJpZCI6…}
    end
    end

    %% UC2: View POI Details
    rect rgb(240,240,240)
    note over User,React: UC2 – View POI Details
    User->>React: tap marker
    React->>Node: GET /pois/{poiId}
    Node->>PostgreSQL: fetch poi + posts
    alt softDeleted=true posts only
       Node->>Node: filter them out
    end
    Node-->>React: 200 PoiDetails JSON
    React->>React: render <PoiCard>
    end

    %% UC4: Register Business
    rect rgb(240,240,240)
    note over User,IG: UC4 – Register Business
    User->>React: open /cadastro
    React->>User: form (CNPJ, @, legal name)
    User->>React: submit
    React->>Node: POST /businesses {payload}
    Node->>IG: GET /{ig-user}?fields=id
    IG-->>Node: 200 igId
    Node->>PostgreSQL: BEGIN TX
    Node->>PostgreSQL: INSERT Business
    Node->>PostgreSQL: INSERT PendingApproval
    Node->>PostgreSQL: COMMIT
    Node-->>React: 201 {businessId, status=PENDING}
    React->>User: "Cadastro enviado para aprovação"
    alt IG handle not found / 404
       IG-->>Node: 404
       Node-->>React: 422 {field: "instagramHandle", msg: "Perfil não existe"}
    end
    end

    %% Admin Approves Business
    rect rgb(240,240,240)
    note over Admin,PostgreSQL: UC9 – Admin Approves Business
    Admin->>React: open /admin/pending
    React->>Node: GET /admin/pending
    Node->>PostgreSQL: SELECT … WHERE status=PENDING
    PostgreSQL-->>Node: rows
    Node-->>React: 200 list
    Admin->>React: click "Aprovar"
    React->>Node: PATCH /admin/businesses/{id}/approve
    Node->>PostgreSQL: UPDATE Business SET approved=true
    Node->>PostgreSQL: INSERT BusinessApproved (audit)
    Node-->>React: 200
    Node->>React: websocket push "approved"
    React->>Business: notify email
    end

    %% Purchase Boost
    rect rgb(240,240,240)
    note over Business,PostgreSQL: UC5 – Purchase Boost (mock)
    Business->>React: tap "Quero Boost"
    React->>Node: GET /plans
    Node->>PostgreSQL: SELECT Plan
    PostgreSQL-->>Node: rows
    Node-->>React: 200 plans[]
    Business->>React: select Boost
    React->>Node: POST /subscriptions {businessId, planId}
    Node->>PostgreSQL: INSERT Subscription ACTIVE
    Node-->>React: 201 {subscriptionId, active=true}
    React->>Business: success toast + badge "Boosted"
    alt duplicate active subscription
       Node-->>React: 409
       React->>Business: "Você já tem um plano ativo"
    end
    end

    %% Nightly ingestion
    rect rgb(240,240,240)
    note over Cron,S3: Nightly Content Ingestion
    Cron->>Node: POST /jobs/ingest
    loop each hashtag [#festaportoalegre]
       Node->>IG: GET /ig_hashtag_search?q=festaportoalegre
       IG-->>Node: tagId
       Node->>IG: GET /{tagId}/recent_media
       alt 200 OK
          IG-->>Node: media[]
          Node->>Node: classify(keywords)
          Node->>GG: placeId from location
          Node->>PostgreSQL: INSERT Post … ON CONFLICT UPDATE
          Node->>S3: PUT cached image
       else 429 quota exceeded
          Node->>Cron: log & early exit
       end
    end
    Node->>Cron: exit 0
    end
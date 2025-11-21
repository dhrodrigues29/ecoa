classDiagram
    direction LR

    class PoiSource{
        <<enumeration>>
        OSM
        GOOGLE
        INTERNAL
    }
    class SubscriptionStatus{
        <<enumeration>>
        ACTIVE
        CANCELLED
    }
    class BusinessStatus{
        <<enumeration>>
        PENDING
        APPROVED
        REJECTED
        SUSPENDED
    }

    class Plan{
        +string id
        +string name
        +number priceBRL
        +string[] features
    }

    class Coordinate{
        +number lat
        +number lng
    }

    class User{
        +string id
        +string phone
        +boolean consentLGPD
        +Date createdAt
    }

    class Business{
        +string id
        +string cnpj
        +string legalName
        +string instagramHandle
        +string contactEmail
        +BusinessStatus status
        +string? poiId
        +Date createdAt
    }

    class Poi{
        +string id
        +string name
        +PoiSource source
        +string externalId
        +Coordinate location
        +string? instagramHandle
        +JsonObject address   // cached OSM / Google response
        +Date createdAt
        +Date updatedAt
    }

    class Subscription{
        +string id
        +string businessId
        +string planId
        +Date startsAt
        +Date endsAt
        +string? stripeCustomerId
        +string? stripeSubscriptionId
        +SubscriptionStatus status
    }

    class Post{
        +string id
        +string poiId
        +string igMediaId
        +string caption
        +string imageUrl   // full S3 URL
        +JsonObject classification
        +boolean softDeleted
        +Date fetchedAt
    }

    class Tag{
        +string id
        +string name
        +string category
    }

    class PoiTag{
        +string poiId
        +string tagId
    }

    class Flag{
        +string id
        +string targetType   // 'POST' | 'POI'
        +string targetId
        +string reason
        +string reporterId
        +string? adminId
        +string status
        +Date createdAt
    }

    class RateLimit{
        +string key
        +number count
        +Date expireAt
    }

    %% relationships
    Business "1" -- "0..1" Poi : owns
    Business "1" -- "*" Subscription : history
    Poi "1" -- "*" Post : contains
    Poi "1" -- "*" PoiTag : tagged
    Tag "1" -- "*" PoiTag : used
    User "1" -- "*" Flag : reports
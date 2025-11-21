classDiagram
    User <|-- Business
    User "1" --> "*" Flag
    Business "1" --> "*" Poi
    Business "1" --> "*" Subscription
    Plan "1" --> "*" Subscription
    Poi "1" --> "*" Post
    Post "1" --> "0..1" Flag
    Admin "1" --> "*" BusinessApproved

    class User {
      +String id
      +String phone
      +boolean consentLGPD
      +Date createdAt
      +search(string, LatLngBounds) SearchResult
      +viewPoi(string) PoiDetails
    }

    class Business {
      +String cnpj
      +String legalName
      +String instagramHandle
      +register(BusinessDTO) Business
      +linkPoi(string) Poi
      +subscribe(Plan) Subscription
      +cancelSubscription()
    }

    class Plan {
      +String id
      +String name
      +float priceBRL
      +JSON features
    }

    class Subscription {
      +String id
      +String businessId
      +String planId
      +Date startsAt
      +Date endsAt
      +String stripeId
      +String status
      +isActive(Date) boolean
    }

    class Poi {
      +String id
      +String googlePlaceId
      +String nameCached
      +String instagramHandle
      +Point location
      +posts() Post[]
      +owner() Business
    }

    class Post {
      +String id
      +String poiId
      +String igMediaId
      +String igCaption
      +String igMediaUrl
      +String s3Key
      +JSON classification
      +boolean softDeleted
      +Date fetchedAt
    }

    class Flag {
      +String id
      +String targetType
      +String targetId
      +String reason
      +String reporterId
      +String adminId
      +String status
      +Date createdAt
    }

    class BusinessApproved {
      +String adminId
      +String businessId
      +Date approvedAt
    }

    class SearchResult {
      +Poi poi
      +Post[] posts
      +boolean isBoosted
    }

    class PoiDetails {
      +Poi poi
      +Post[] posts
      +Subscription subscription
    }

    class MapView {
      +Object viewport
      +Object[] markers
      +onBoundsChange()
    }

    class PoiCard {
      +PoiDetails props
    }

    class BusinessDashboard {
      +Business business
      +Subscription subscription
      +Object analytics
    }
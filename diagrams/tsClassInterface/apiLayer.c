classDiagram
    direction LR

    class PoiService{
        +create(data: CreatePoiDto): Promise<Poi>
        +searchNearby(center: Coordinate, radiusKm: number): Promise<Poi[]>
        +boostedByPlan(planId: string): Promise<Poi[]>
    }

    class PostService{
        +fetchFromInstagram(hashtag: string): Promise<Post[]>
        +classify(post: Post): JsonObject
    }

    class BusinessService{
        +register(dto: RegisterBusinessDto): Promise<Business>
        +approve(id: string, adminId: string): Promise<void>
    }

    class SubscriptionService{
        +subscribe(businessId: string, planId: string): Promise<Subscription>
        +cancel(id: string): Promise<void>
    }

    class MapRenderer{
        +render(center: Coordinate, pois: Poi[]): MapTile
    }

    class RateLimiter{
        +consume(key: string, limit: number): Promise<boolean>
    }

    PoiService ..> MapRenderer : uses
    PostService ..> Post : creates
    SubscriptionService ..> Subscription : manages
    RateLimiter ..> RateLimit : stores
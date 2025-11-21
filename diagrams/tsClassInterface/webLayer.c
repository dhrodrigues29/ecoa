classDiagram
    direction LR

    class MapView{
        +viewport: Viewport
        +markers: Marker[]
        +onMoveEnd(coord: Coordinate)
        +onPoiClick(poi: Poi)
    }

    class PoiCard{
        +poi: Poi
        +posts: Post[]
        +onClose()
        +onExternal(url: string)
    }

    class SearchBar{
        +value: string
        +onSearch(text: string)
    }

    class TagBar{
        +tags: Tag[]
        +selected: string[]
        +onToggle(tagId: string)
    }

    class AdvancedSearchModal{
        +isOpen: boolean
        +onApply(filters: Filter[])
        +onCancel()
    }

    class PartnerWizard{
        +step: 'identify' | 'selectPoi' | 'selectPlan' | 'payment'
        +onComplete()
    }

    MapView ..> PoiCard : renders
    SearchBar ..> MapView : triggers move
    TagBar ..> MapView : filters
    AdvancedSearchModal ..> MapView : filters
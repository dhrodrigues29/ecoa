stateDiagram-v2
    direction LR
    [*] --> OPEN
    OPEN --> IN_PROGRESS: adminStartsReview
    IN_PROGRESS --> CLOSED: adminCloses
    CLOSED --> [*]
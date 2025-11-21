stateDiagram-v2
    direction LR
    [*] --> VISIBLE
    VISIBLE --> HIDDEN: adminHides
    HIDDEN --> VISIBLE: adminRestores
    HIDDEN --> [*]: expiryCleanup
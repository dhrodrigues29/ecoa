stateDiagram-v2
    direction LR
    [*] --> PENDING
    PENDING --> APPROVED: adminApproves
    PENDING --> REJECTED: adminRejects
    REJECTED --> PENDING: userResubmits
    APPROVED --> SUSPENDED: adminSuspends
    SUSPENDED --> APPROVED: adminReinstates
    APPROVED --> [*]: userDeletes
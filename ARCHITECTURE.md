# MSV2 Architecture & Infrastructure

This document visualizes the architecture of the MSV2 Music Library project, showcasing the full-stack implementation on a K3s Kubernetes cluster.

## 1. System Context

High-level overview of how users interact with the system.

```mermaid
graph LR
    User((User))
    subgraph "K3s Cluster (Home Lab)"
        WebApp[MSV2 WebApp\n(React/Vite)]
        API[MSV2 API\n(FastAPI)]
        DB[(PostgreSQL\n+ pgvector)]
        MinIO[(MinIO\nObject Storage)]
    end

    User -->|HTTPS| WebApp
    WebApp -->|JSON/REST| API
    API -->|SQL| DB
    API -->|S3 Protocol| MinIO
    API -->|Vector Search| DB
```

## 2. Container Architecture (K3s)

Detailed view of the Kubernetes deployment and networking.

```mermaid
graph TB
    subgraph "K3s Cluster Nodes (3x Mini PCs)"
        Ingress[Nginx Ingress Controller]
        
        subgraph "Frontend Pods"
            WebPod[WebApp Pod]
        end
        
        subgraph "Backend Pods"
            APIPod[API Pod]
            WorkerPod[Worker Pod\n(Async Tasks)]
        end
        
        subgraph "Data Layer"
            Postgres[(PostgreSQL\nPrimary)]
            MinIOCluster[(MinIO\nDistributed)]
        end
    end

    Internet((Internet)) -->|HTTPS/443| Ingress
    Ingress -->|/api| APIPod
    Ingress -->|/| WebPod
    
    APIPod -->|Read/Write| Postgres
    APIPod -->|Store Audio| MinIOCluster
    WorkerPod -->|Process Audio| MinIOCluster
    WorkerPod -->|Update Embeddings| Postgres
```

## 3. Data Flow: Vector Similarity Search

Sequence of events for the "Similar Tracks" feature, highlighting the Data Science/AI integration.

```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant API
    participant PG as PostgreSQL (pgvector)

    User->>WebApp: Click "Find Similar" on Track A
    WebApp->>API: GET /music/similar/{track_id}
    API->>PG: SELECT embedding FROM tracks WHERE id = track_id
    PG-->>API: Returns Vector[512]
    
    Note over API, PG: Cosine Similarity Search
    API->>PG: SELECT * FROM tracks ORDER BY embedding <=> vector LIMIT 10
    PG-->>API: Returns Top 10 Nearest Neighbors
    
    API-->>WebApp: Returns List[Track]
    WebApp-->>User: Displays Recommended Tracks
```

## 4. Infrastructure as Code (GitOps)

Overview of the deployment pipeline.

```mermaid
graph LR
    Dev[Developer] -->|Push| Git[GitOps Repo]
    ArgoCD[ArgoCD] -->|Watch| Git
    ArgoCD -->|Sync| K3s[K3s Cluster]
    
    subgraph "Managed Resources"
        Svc[Services]
        Deploy[Deployments]
        Ing[Ingress]
        PVC[Persistent Volumes]
    end
    
    K3s --> Svc
    K3s --> Deploy
    K3s --> Ing
    K3s --> PVC
```

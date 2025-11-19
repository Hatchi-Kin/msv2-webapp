# MSV2 Architecture & Infrastructure

This document visualizes the architecture of the MSV2 Music Library project, showcasing the full-stack implementation on a K3s Kubernetes cluster.

## 1. System Context

High-level overview of how users interact with the system.

```mermaid
graph LR
    User((User))
    subgraph K3s["K3s Cluster (Home Lab)"]
        WebApp["MSV2 WebApp<br/>(React/Vite)"]
        API["MSV2 API<br/>(FastAPI)"]
        DB[("PostgreSQL<br/>+ pgvector")]
        MinIO[("MinIO<br/>Object Storage")]
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
    subgraph Cluster["K3s Cluster Nodes (3x Mini PCs)"]
        Ingress["Nginx Ingress<br/>Controller"]
        
        subgraph Frontend["Frontend Pods"]
            WebPod["WebApp Pod"]
        end
        
        subgraph Backend["Backend Pods"]
            APIPod["API Pod"]
            WorkerPod["Worker Pod<br/>Async Tasks"]
        end
        
        subgraph Data["Data Layer"]
            Postgres[("PostgreSQL<br/>Primary")]
            MinIOCluster[("MinIO<br/>Distributed")]
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
    participant PG as PostgreSQL with pgvector
    
    User->>WebApp: Click Find Similar on Track A
    WebApp->>API: GET /music/similar/track_id
    API->>PG: SELECT embedding FROM tracks WHERE id = track_id
    PG-->>API: Returns Vector 512
    
    Note over API,PG: Cosine Similarity Search
    API->>PG: SELECT * FROM tracks ORDER BY embedding
    PG-->>API: Returns Top 10 Nearest Neighbors
    
    API-->>WebApp: Returns List of Tracks
    WebApp-->>User: Displays Recommended Tracks
```

## 4. Infrastructure as Code (GitOps)

Overview of the deployment pipeline.

```mermaid
graph LR
    Dev["Developer"]
    Git["GitOps Repo"]
    ArgoCD["ArgoCD"]
    K3s["K3s Cluster"]
    
    subgraph Resources["Managed Resources"]
        Svc["Services"]
        Deploy["Deployments"]
        Ing["Ingress"]
        PVC["Persistent Volumes"]
    end
    
    Dev -->|Push| Git
    ArgoCD -->|Watch| Git
    ArgoCD -->|Sync| K3s
    
    K3s --> Svc
    K3s --> Deploy
    K3s --> Ing
    K3s --> PVC
```

## Key Architecture Highlights

**Frontend Layer**: React/Vite single-page application served through Nginx Ingress, providing responsive UI for music library management.

**Backend Layer**: FastAPI microservice handling business logic, REST endpoints, and vector similarity computations. Worker pods manage asynchronous tasks like audio processing and embedding generation.

**Data Layer**: PostgreSQL with pgvector extension enables semantic search by storing and querying audio embeddings. MinIO distributed object storage handles audio file management with S3-compatible API.

**Kubernetes Infrastructure**: K3s lightweight cluster running on 3 mini PCs provides container orchestration with Nginx ingress for external traffic routing and ArgoCD for GitOps-driven deployments.

**ML/AI Integration**: Vector embeddings stored in PostgreSQL enable semantic similarity search, allowing the system to find musically related tracks through cosine similarity computations.

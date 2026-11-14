---
name: kubernetes
description: Kubernetes — deployments, services, ingress, ConfigMaps, secrets, HPA, resource limits, health checks, namespaces, and production patterns for deploying AI/ML services.
triggers: [kubernetes, k8s, kubectl, deployment yaml, kubernetes pod, k8s ingress, hpa autoscaling, kubernetes secret, kubernetes configmap, helm, kubernetes service]
version: "1.0"
source: https://kubernetes.io/docs
---

# Kubernetes

## Deployment (production pattern)
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
  labels: { app: api, version: "1.2.0" }
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: ghcr.io/myorg/api:1.2.0  # always pin exact tag
          ports: [{ containerPort: 8000 }]
          resources:
            requests: { cpu: "250m", memory: "512Mi" }
            limits:   { cpu: "1000m", memory: "1Gi" }
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef: { name: db-secret, key: url }
            - name: LOG_LEVEL
              valueFrom:
                configMapKeyRef: { name: api-config, key: log-level }
          livenessProbe:
            httpGet: { path: /health, port: 8000 }
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet: { path: /ready, port: 8000 }
            initialDelaySeconds: 5
            periodSeconds: 5
          securityContext:
            runAsNonRoot: true
            runAsUser: 1000
            allowPrivilegeEscalation: false
      terminationGracePeriodSeconds: 30
```

## Service + Ingress
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata: { name: api, namespace: production }
spec:
  selector: { app: api }
  ports: [{ port: 80, targetPort: 8000 }]
  type: ClusterIP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
  namespace: production
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"  # for LLM requests
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls: [{ hosts: [api.example.com], secretName: api-tls }]
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service: { name: api, port: { number: 80 } }
```

## ConfigMap + Secret
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata: { name: api-config, namespace: production }
data:
  log-level: "info"
  max-connections: "20"

---
# secret (create with kubectl, not in git)
# kubectl create secret generic db-secret --from-literal=url='postgresql://...' -n production
apiVersion: v1
kind: Secret
metadata: { name: db-secret, namespace: production }
type: Opaque
data:
  url: <base64-encoded-value>  # echo -n 'value' | base64
```

## Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: api, namespace: production }
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 70 }
    - type: Resource
      resource:
        name: memory
        target: { type: Utilization, averageUtilization: 80 }
```

## Essential kubectl commands
```bash
# View
kubectl get pods -n production -w            # watch pods
kubectl describe pod <name> -n production    # debug pod
kubectl logs -f <pod> -n production --tail=100
kubectl exec -it <pod> -n production -- bash # shell into pod

# Apply / deploy
kubectl apply -f k8s/                        # apply all in dir
kubectl rollout status deployment/api -n production
kubectl rollout history deployment/api -n production
kubectl rollout undo deployment/api -n production  # rollback

# Scale
kubectl scale deployment/api --replicas=5 -n production

# Secrets / configs
kubectl get secret db-secret -n production -o jsonpath='{.data.url}' | base64 -d
kubectl set env deployment/api LOG_LEVEL=debug -n production

# Troubleshoot
kubectl get events -n production --sort-by='.lastTimestamp'
kubectl top pods -n production               # CPU/memory usage
```

## Resource sizing for AI workloads
| Workload | CPU request | Memory request | Notes |
|---|---|---|---|
| FastAPI (no ML) | 250m | 256Mi | Light |
| FastAPI + LLM client | 500m | 512Mi | API calls only |
| Embedding model (small) | 2000m | 2Gi | CPU inference |
| GPU inference pod | 500m CPU | 8Gi + 1 GPU | Use node selector |

```yaml
# GPU node selector
nodeSelector: { "nvidia.com/gpu": "true" }
resources:
  limits: { nvidia.com/gpu: "1" }
```

## Rules
- Never use `latest` tag — pin to exact image digest or semver
- Always set resource `requests` AND `limits` — prevents noisy neighbor
- `maxUnavailable: 0` for zero-downtime rolling deploys
- Liveness ≠ Readiness: liveness restarts the pod; readiness removes it from load balancer
- Store secrets in Vault or External Secrets Operator — not in git
- Namespaces: `production`, `staging`, `dev` — RBAC per namespace

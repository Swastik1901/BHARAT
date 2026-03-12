# CCPA Compliance Detection System
## OPEN HACK 2026 — CSA, IISc

---

## Solution Overview

This system uses **Mistral-7B-Instruct-v0.2** (a 7 billion parameter LLM) to analyze whether a described business practice violates the California Consumer Privacy Act (CCPA).

### How It Works

```
User Prompt
    │
    ▼
┌─────────────────────────────────────────┐
│  Build prompt with CCPA law as context  │
│  + the business practice description    │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Mistral-7B-Instruct LLM               │
│  Reads the law, reads the practice,    │
│  reasons about violations              │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Parse JSON from LLM output            │
│  Validate structure and consistency    │
└─────────────────────────────────────────┘
    │
    ▼
{"harmful": true/false, "articles": [...]}
```

### Architecture
- **Model:** `mistralai/Mistral-7B-Instruct-v0.2` (7B parameters, within 8B limit)
- **Framework:** HuggingFace Transformers + FastAPI
- **Inference:** GPU (CUDA) with float16 precision for speed
- **Context:** CCPA statute sections are embedded directly in the prompt
- **Model loading:** Pre-downloaded at Docker build time — no download at inference

---

## Docker Run Command

```bash
# Without HF token (Mistral-7B is public, no token needed)
docker run --gpus all -p 8000:8000 yourusername/ccpa-compliance:latest

# With HF token (if using a gated model)
docker run --gpus all -p 8000:8000 -e HF_TOKEN=hf_xxxx yourusername/ccpa-compliance:latest
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_TOKEN` | No | HuggingFace access token. Not required for Mistral-7B (public model). Required only if you switch to a gated model like Llama. |

---

## GPU Requirements

| Requirement | Value |
|------------|-------|
| Minimum GPU VRAM | 16 GB (float16) |
| Recommended | 24 GB |
| CPU-only fallback | Yes (very slow, ~60s per request) |
| Tested on | NVIDIA A100, RTX 3090 |

---

## Building the Docker Image

```bash
# Clone / unzip the project
cd ccpa-compliance

# Build the image (this downloads the model — takes ~15-20 mins first time)
docker build -t yourusername/ccpa-compliance:latest .

# Push to Docker Hub
docker login
docker push yourusername/ccpa-compliance:latest
```

---

## Local Setup Instructions (Fallback — No Docker)

```bash
# Requirements: Python 3.11+, CUDA toolkit installed

# Install dependencies
pip install fastapi uvicorn transformers torch accelerate sentencepiece protobuf

# Download the model first
python download_model.py

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000

# Test it
curl http://localhost:8000/health
```

---

## API Usage Examples

### Health Check
```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

### Analyze — Violation Detected
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "We sell user browsing data to ad networks without giving users any way to opt out."}'

# {"harmful":true,"articles":["Section 1798.120"]}
```

### Analyze — No Violation
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "We provide a clear privacy policy and honor all deletion requests within 45 days."}'

# {"harmful":false,"articles":[]}
```

### Interactive API Docs
Visit `http://localhost:8000/docs` for a browser-based interface to test the API.

---

## CCPA Sections Covered

| Section | Consumer Right |
|---------|---------------|
| 1798.100 | Know what data is collected |
| 1798.105 | Delete personal data |
| 1798.106 | Correct inaccurate data |
| 1798.110 | Access collected data |
| 1798.115 | Know what is sold/shared |
| 1798.120 | Opt out of data sale/sharing |
| 1798.121 | Limit sensitive data use |
| 1798.125 | No retaliation for exercising rights |
| 1798.130 | Notice and disclosure requirements |
| 1798.135 | Opt-out mechanism on homepage |

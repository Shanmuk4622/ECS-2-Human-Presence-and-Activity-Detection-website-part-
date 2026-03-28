# ECS-2 Detailed Documentation

## 1. Project overview

ECS-2 explores human presence and activity detection using Wi-Fi Channel State Information (CSI) and deep learning. The project combines:

- Commodity RF hardware (ESP32-S3 modules + 2.4 GHz Wi-Fi router)
- Directional antenna design (biquad)
- CSI signal processing into spectrogram representations
- CNN-based classification (EfficientNetV2-S)
- A web-based 3D and dashboard experience for demonstration

This document is based on the repository assets and the review source document (`ECS-2 review PDF.pdf`).

## 2. Goals and motivation

Primary goals:

- Build a low-cost, privacy-preserving, non-vision human sensing pipeline.
- Detect human presence/activity by learning CSI-derived time-frequency patterns.
- Demonstrate practical integration of embedded systems, RF hardware, and AI.

Why it matters:

- No camera requirement for core sensing logic
- Strong applicability in smart environments, safety, and security scenarios
- Uses widely available hardware components

## 3. System architecture

### 3.1 Hardware layer

- Transmitter:
  - Standard 2.4 GHz Wi-Fi router (modified for external antenna use where needed)
- Receiver:
  - ESP32-S3-Mini-1U modules for CSI extraction
- Compute/control:
  - Raspberry Pi 4B+ (pipeline orchestration/monitoring)
- RF front-end:
  - Directional biquad antenna configuration
- Passive components:
  - Supporting capacitors/resistors/cabling and power interfaces

### 3.2 Data pipeline layer

1. Receive CSI from Wi-Fi packet streams (beacon/data frames).
2. Forward CSI over serial to processing host.
3. Apply filtering (for example Hampel-based outlier removal).
4. Convert CSI windows to spectrogram images.
5. Feed spectrograms to classification model.

### 3.3 ML layer

- Model family:
  - EfficientNetV2-Small (torchvision implementation)
- Input representation:
  - Approx. 52 x 400 spectrogram (subcarriers x time samples)
- Typical training assumptions from review notes:
  - Optimizer: Adam
  - Learning rate: 1e-4
  - Batch size: 16
  - Multiple runs with aggregated metrics (precision/recall/F1/accuracy)

## 4. Repository structure

```text
ECS-2/
  Antenna_ver_1-Body.step
  Antenna_ver_1-Body.glb
  box-ver_1-Body.glb
  one1.glb
  ECS-2 review PDF.pdf
  index.html
  model-viewer.html
  style.css
  app.js
  .gitignore
  .gitattributes
  .editorconfig
  requirements.txt
  README.md
  README_DETAILED.md
```

## 5. Frontend stack and behavior

### 5.1 Main page (`index.html`)

- Hero and product narrative UI
- Hardware component cards
- Simulated live dashboard panels
- Integration with:
  - Three.js (hero visualization)
  - GSAP + ScrollTrigger (motion/scroll effects)
  - Typed.js (animated text)

### 5.2 3D viewer (`model-viewer.html`)

- Dedicated Three.js viewer for `.glb` assets
- Features:
  - Orbit controls
  - Model switching (assembly/antenna/enclosure)
  - Wireframe mode
  - Explode view
  - Dynamic camera fitting and loading status

## 6. Setup guide

### 6.1 Run the web demo

Use any static server so model assets are loaded correctly:

```powershell
# Python option
python -m http.server 8000

# Node option
npx serve .
```

Then open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/model-viewer.html`

### 6.2 Prepare Python environment (pipeline work)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

Notes:

- Python dependencies are for CSI processing/model experiments.
- The website itself does not require Python packages.

## 7. Data and model workflow (recommended)

1. Capture CSI frames from ESP32 receiver stream.
2. Serialize raw packets with timestamp and metadata.
3. Apply denoising/outlier handling.
4. Build fixed-size CSI windows.
5. Generate spectrogram datasets and labels.
6. Train EfficientNetV2-S baselines.
7. Track confusion matrix and per-class F1.
8. Export model and inference script for edge deployment.

## 8. Engineering roadmap (from review phases)

- Phase 1: Hardware + antenna + initial CSI validation
- Phase 2: Pipeline integration + DL model training
- Phase 3: Optimization and real-world deployment testing

Current repository status:

- Frontend showcase and 3D assets are present.
- Documentation and repository hygiene files are now in place.
- Python dependency baseline is ready for pipeline code integration.

## 9. Quality and repository practices

This repo now includes:

- `.gitignore` to avoid committing transient artifacts
- `.editorconfig` for consistent formatting
- `.gitattributes` for correct binary handling
- Structured READMEs (brief + detailed)
- Explicit optional Python dependency file

Recommended additions when code modules are added:

- `src/` for Python pipeline code
- `tests/` with unit/integration tests
- `scripts/` for data preparation and training entrypoints
- CI workflow for lint/test/build checks

## 10. Suggested next implementation tasks

1. Add a Python package skeleton for CSI ingestion and preprocessing.
2. Add a training script for EfficientNetV2-S with configurable datasets.
3. Add evaluation reports and reproducible experiment configs.
4. Add API layer to stream real metrics into the existing dashboard UI.
5. Add deployment notes for Raspberry Pi based inference.

## 11. References

The review document points to ESP-IDF, ESP32 CSI tooling, and related Wi-Fi CSI research resources. Keep the review PDF as the source of truth for bibliography and project review history.

- Source: `ECS-2 review PDF.pdf`

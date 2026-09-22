# Smart Community Health Monitoring and Early Warning System for Waterborne Diseases

*(Working name: AquaSentinel)*

A full-stack water safety platform that predicts drinking water potability using a trained machine learning model, maps contamination patterns to waterborne disease risk, explains its own predictions, and correlates water quality with community-reported illness trends to flag potential outbreaks early.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Machine Learning Model](#machine-learning-model)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Role-Based Access](#role-based-access)
- [Known Limitations](#known-limitations)
- [Future Work](#future-work)
- [Contributors](#contributors)

---

## Overview

Access to safe drinking water remains a critical public health requirement, and waterborne diseases such as cholera, typhoid, dysentery, and hepatitis A continue to cause widespread illness where real-time water-quality monitoring is inadequate. This project combines:

- A **machine-learning classification core** that predicts water potability from physicochemical parameters
- A **rule-based disease-risk mapping engine** built on WHO/EPA safe-limit violations
- An **explainability layer** that shows exactly why a prediction was made, not just what it is
- A **community symptom correlation module** that cross-references reported illness trends with water quality data to flag possible outbreaks

into a single, deployable, software-only system — requiring no physical sensors or lab equipment beyond standard water-testing readings.

---

## Key Features

### Core Prediction Pipeline
1. **ML-based potability prediction** — XGBoost classifier trained on 1,000,000 water samples
2. **WHO/EPA parameter violation detection** — flags out-of-range readings across 9 physicochemical parameters
3. **Rule-based disease risk mapping** — 11 clinically-motivated rules linking violation patterns to cholera, typhoid, dysentery, hepatitis A, and more
4. **Composite risk scoring (0–100)**
5. **Tiered safety verdicts** — Safe / Marginal / Unsafe / Critically Unsafe
6. **Actionable recommendations** based on which parameters failed

### Explainability Layer
7. **Per-prediction feature importance**
8. **SHAP-style explainability** (Saabas-method tree attribution) — explains *why* each individual prediction was made, not just an aggregate ranking

### Adaptive & Reporting Layer
9. **Confidence-based borderline flagging** — flags predictions near the decision boundary instead of presenting them with false certainty
10. **Region-adjustable threshold profiles** — Standard (WHO/urban) vs. Rural baseline, without retraining the model
11. **Batch CSV analysis** — dataset-wide contamination burden summaries
12. **Prediction history tracking**
13. **Exportable PDF reports**
14. **Model transparency page** — real accuracy/AUC/cross-validation stats surfaced in-app

### Community Health Extension
15. **Community symptom correlation module** — statistical outbreak-aberration detection (μ+2σ / μ+3σ thresholds) on community-reported illness data, cross-referenced against the ML water verdict for the same location to produce a combined confidence signal

---

## Machine Learning Model

| Metric | Value |
|---|---|
| Model type | XGBoost Classifier |
| Training data | 1,000,000 real water-quality samples |
| Train/test split | 800,000 / 200,000 (stratified) |
| Features | 16 (9 raw physicochemical + 7 engineered) |
| Accuracy | **82.07%** |
| AUC | **0.884** |
| Cross-validation mean | 82.13% ± 0.10% |

**A note on model integrity:** during development, an engineered feature (`who_violation_count`) was found to be a near-perfect deterministic proxy for the target label, producing an artificially inflated ~99.99% accuracy. This feature was identified and removed from the model's inputs — the 82.07% figure above reflects the model genuinely learning from physicochemical patterns rather than a labeling shortcut. The violation-counting logic itself remains fully intact as a separate rule-based feature (Feature #2), independent of the ML model.

The trained scikit-learn/XGBoost pipeline is exported to portable JSON artifacts (tree structure, scaler parameters, imputer statistics) and re-implemented natively in JavaScript for the Node.js backend — verified to match the original Python model's output to within 10⁻⁸ precision.

---

## Tech Stack

**Backend**
- Node.js / Express
- MongoDB (Mongoose)
- JWT authentication + bcrypt password hashing
- Nodemailer (email OTP verification)
- pdfkit (PDF report generation)
- multer + csv-parser (batch CSV upload)
- Jest (testing)

**Frontend**
- React (functional components + hooks)
- React Router
- Axios
- Recharts (data visualization)
- Tailwind CSS
- Framer Motion

**Machine Learning**
- Python (scikit-learn, XGBoost, pandas, numpy)
- Trained and exported via Google Colab

---

## Architecture

```
Water Parameters (input)
        │
        ▼
Preprocessing (imputation + scaling + feature engineering)
        │
        ▼
XGBoost Model ──────► Safe/Unsafe Probability
        │
        ▼
WHO Violation Check (region-adjustable) ──► Violation List
        │
        ▼
Rule-Based Disease Mapping ──► Candidate Diseases
        │
        ▼
Composite Risk Scoring ──► Risk Score + Verdict + Recommendations
        │
        ▼
Explainability Layer ──► Feature Contributions
        │
        ▼
Confidence Assessment ──► Borderline Flagging
        │
        ▼
Saved to Database ──► History / Reports / Batch Summaries
```

In parallel, the **Community Symptom Correlation Module** independently tracks illness reports per location and cross-references them against the most recent water verdict for that same location.

---

## Project Structure

```
water_backend/
├── model_artifacts/        # Exported ML model (JSON tree, scaler, imputer stats)
├── src/
│   ├── config/              # DB, WHO thresholds, email config
│   ├── models/              # Mongoose schemas
│   ├── services/            # Business logic
│   ├── controllers/         # Request handlers
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth, validation, upload, error handling
│   └── utils/                 # Disease rules, statistics, helpers
└── tests/

water_frontend/
├── src/
│   ├── components/          # UI components (layout, results, charts, ui)
│   ├── pages/                 # Route-level pages
│   ├── services/              # API integration layer
│   ├── context/               # Auth state
│   └── lib/                    # Shared helpers
```

---

## Getting Started

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
EMAIL_USER=<your gmail address>
EMAIL_PASS=<your gmail app password>
EMAIL_FROM=<your gmail address>
OTP_EXPIRY_MINUTES=10
```

Place the exported model files in `model_artifacts/`:
`xgb_model.json`, `scaler_params.json`, `imputer_stats.json`, `feature_order.json`, `model_meta.json`

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Tests

```bash
cd backend
npm test
```

---

## API Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new account | Public |
| POST | `/api/auth/verify-otp` | Verify email with OTP | Public |
| POST | `/api/auth/login` | Log in, returns JWT | Public |
| POST | `/api/predict` | Analyze a single water sample | Authenticated |
| POST | `/api/predict/batch` | Analyze a CSV of many samples | ASHA Worker / Admin |
| GET | `/api/history` | View own prediction history | Authenticated |
| GET | `/api/history/all` | View all users' history | Admin |
| GET | `/api/report/:id/export` | Download a PDF report | Authenticated (owner or admin) |
| GET | `/api/model` | View model performance stats | Authenticated |
| POST | `/api/symptoms` | Log community symptom data | ASHA Worker / Admin |
| GET | `/api/symptoms/:location/status` | Get outbreak risk status | Authenticated |

---

## Role-Based Access

| Role | Capabilities |
|---|---|
| **User** | Submit water samples, view own history, download own reports |
| **ASHA Worker** | Everything a User can do, plus batch CSV analysis and community symptom logging |
| **Admin** | Everything above, plus organization-wide history access across all users |

---

## Model 

**Model Training Notebook:** [View on Google Colab](https://colab.research.google.com/drive/1kQP2X70YMdNasln1v0bgTCPSp6f7uoRx?usp=drive_link)


## Known Limitations

- The rule-based disease-mapping engine reflects established public health associations but has not been clinically validated against confirmed outbreak records.
- Region-adjustable threshold profiles (Standard/Rural) are currently manually configured presets, not derived from field-collected regional data.
- The community symptom correlation module links to a water prediction via an exact-string location match, with no fuzzy matching or geocoding.
- The system has not undergone field deployment or validation using real, on-site collected water samples.

---

## Future Work

- Validate the trained model and disease-mapping rules against real field-collected water samples
- Calibrate region-adjustable thresholds using actual regional water-quality and health-outcome data
- Extend location matching in the community health module with normalization or geocoding
- Conduct a pilot deployment with a health authority or academic partner

---

## Contributors

- [Hardhik Shetty R](https://github.com/Hardhikshettyr)
- [Charan T M](https://github.com/charantm7)
- [Dheeraj Gowda Y S](https://github.com/dheerajgowdays)
- [Bharath Halemane H V](https://github.com/bharathhalemane)
- [Boomika S N](https://github.com/Bhumika-SN)

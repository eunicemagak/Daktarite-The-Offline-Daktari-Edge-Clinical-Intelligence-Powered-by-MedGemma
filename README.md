# Daktarite 🩺 AI Where Care Happens

**Daktarite** is an **offline clinical AI assistant** powered by MedGemma, designed for low-connectivity healthcare environments.  
“Daktari” means doctor in Swahili—Daktarite brings AI-powered clinical intelligence **directly to the point of care**, without relying on cloud infrastructure.

---

## Features

- **Offline Edge Deployment**
  - Runs entirely on local hardware (laptop or workstation)
  - Quantized 4-bit MedGemma model for efficient inference
  - No internet connection required
  - Local SQLite database for secure case storage

- **Clinical Note Analysis**
  - Extracts structured patient information: name, symptoms, medications, allergies
  - Detects **red-flag clinical indicators**
  - Assigns urgency levels: low, medium, high
  - Applies **deterministic triage rules** to enforce safety

- **Reporting & Logging**
  - Generates PDF summaries of cases
  - Logs inference performance and benchmarking locally
  - Ensures consistent and safe clinical workflows

---

## Why Daktarite?

Most medical AI systems rely on cloud inference, which:

- Requires stable internet  
- Transmits sensitive patient data externally  
- Cannot operate in disaster or remote environments  

Daktarite solves this by combining:

1. **MedGemma 4B IT** – a medical-domain LLM optimized for structured extraction and low hallucination  
2. **Rule-based triage** – deterministic safety layer to reduce under-triage and enforce consistent standards  

The hybrid AI + rules architecture ensures **safer, deterministic, and edge-ready clinical AI**.

---

## Installation

> Requires Python 3.10+  

```bash
git clone https://github.com/eunicemagak/Daktarite-The-Offline-Daktari-Edge-Clinical-Intelligence-Powered-by-MedGemma
cd Daktarite/backend
pip install -r requirements.txt

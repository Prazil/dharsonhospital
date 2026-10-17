# Dharson Hospital — Orthopaedic & Bone Joint Speciality Hospital

Official website repository for **Dharson Hospital**, located in **Namakkal, Tamil Nadu, India**.

## About Dharson Hospital
Dharson Hospital is an orthopaedic speciality centre providing patient-centred care across bone, joint, and musculoskeletal health:
- **Joint Replacement**
- **Fracture & Trauma Care**
- **Arthritis & Joint Pain Management**
- **Sports Injuries & Rehabilitation**
- **Spine & Back Care**
- **Arthroscopy (Minimally Invasive Joint Care)**
- **Paediatric Orthopaedics**
- **General Orthopaedic Consultations**

## Technology Stack
- **Structure:** Clean Semantic HTML5 with Schema.org (`MedicalClinic`, `FAQPage`) JSON-LD structured data
- **Styling:** Vanilla Modern CSS with CSS variables, responsive fluid typography, and glassmorphism
- **Logic:** Vanilla JavaScript (ES6+)
- **Configuration:** Centralized hospital data repository in `js/config.js`
- **Zero External Runtime Dependencies:** Blazing fast loading, 100% accessible, and mobile-first

## Project Structure
```text
├── index.html                  # Main homepage with all sections
├── css/
│   └── main.css                # Design system, responsive styles, animations
├── js/
│   ├── config.js               # Central hospital config & data
│   └── main.js                 # Interactive logic, modals, validations, accordions
├── assets/
│   └── images/                 # High-resolution medical imagery & facilities
├── .gitignore
└── README.md
```

## Running Locally
To run the website locally on any machine:

### Option 1: Python
```bash
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Node.js (npx serve)
```bash
npx serve .
```

### Option 3: Direct File Access
Simply double-click `index.html` to open it directly in any modern web browser.

## Customization Guide
To update hospital phone numbers, official email addresses, exact street location, doctor roster, or FAQ questions, simply edit `js/config.js`.

---
© 2026 Dharson Hospital, Namakkal, Tamil Nadu. All rights reserved.

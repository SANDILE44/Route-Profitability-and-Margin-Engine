# 🚛 Route Profitability & Margin Engine

> **Enterprise-grade browser financial model and dynamic cost-per-KM decision engine for freight and logistics corridors.**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=flat-square&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange?style=flat-square&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-blue?style=flat-square&logo=css3)
![License](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)

---

## 📋 Overview

The **Route Profitability & Margin Engine** is a zero-friction, client-side web application designed to compute unit operational expenses (cost-per-KM), net fleet margins, and automated risk warnings for long-haul freight operations. 

Built with vanilla JavaScript ES6+, the engine eliminates backend latency by executing real-time financial algorithms directly within the browser DOM.

### 🌟 Key Features

* **Dynamic Cost-per-KM Computation:** Live calculation factoring in variable diesel rates, fleet consumption per 100km, route toll charges, and driver daily allowances.
* **Automated Risk Threshold Audit:** Real-time evaluation engine that flags critical margin erosion (`CRITICAL`, `MONITOR`, or `OPTIMAL`).
* **Executive Brief Export:** Integrated client-side PDF generation engine using `html2pdf.js` that compiles live calculations into a white-background executive brief.
* **Zero-Dependency Architecture:** Lightweight, responsive glassmorphism visual interface built with standard Web APIs.

---

## 🛠 Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Glassmorphic System, Flexbox/Grid)
* **Logic & Financial Math:** Vanilla JavaScript ES6+ (Event-driven DOM Manipulation)
* **Visualization & PDF Engine:** FontAwesome 6, `html2pdf.js`

---

## 📊 Core Financial Formula Mechanics

$$\text{Total Operating Expense} = (\text{Distance} \times \text{Maintenance Rate}) + \left(\frac{\text{Distance}}{100} \times \text{Consumption Rate} \times \text{Diesel Rate}\right) + \text{Tolls} + \text{Driver Daily Overhead}$$

$$\text{Cost per KM} = \frac{\text{Total Operating Expense}}{\text{Distance}}$$

$$\text{Net Retained Margin \%} = \left( \frac{\text{Contract Revenue} - \text{Total Operating Expense}}{\text{Contract Revenue}} \right) \times 100$$

---

## 🚀 Quick Setup & Usage

No build tools or backend dependencies required.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/route-profitability-engine.git](https://github.com/your-username/route-profitability-engine.git)

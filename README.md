# CLP Grid-Master: Interactive SOP Training System

This repository contains a high-fidelity interactive prototype designed for training young electrical engineers on critical substation operations.

## 🌟 The "Un-boring" Concept: Gamified Learning
Instead of reading a static manual, users are placed in a **high-stakes simulation** where they must manage a transformer voltage overload.

- **Dynamic Feedback:** Real-time line charts showing voltage fluctuations.
- **Interactive Decision Making:** Integrated Emergency SOP Quiz that requires immediate action before system failure.
- **Visual Impact:** High-contrast UI (Tailwind CSS) that shifts from "Safe Blue" to "Danger Red" to simulate stress.

---

## 🛠️ Technical Implementation (Task 1)

- **Frontend:** React.js with `useState` & `useEffect` for the simulation engine.
- **Data Visualization:** `recharts` for the real-time telemetry feed.
- **Animation:** `framer-motion` for fluid state transitions and emergency overlays.
- **Icons:** `lucide-react` for a clean, industrial dashboard look.

---

## ⚡ Task 2: Interactive Transformer Concept (In-App Animation)
*Replacing traditional video with an interactive "Physics-to-Code" module.*

I have implemented an interactive **Transformer Efficiency & Induction** simulation using React and Framer Motion. This demonstrates:
1. **Electromagnetic Induction:** Visualizing the flow between Primary and Secondary coils.
2. **Real-time Variables:** How adjusting the "Turns Ratio" affects voltage outputs.
3. **Interactive Debugging:** A hands-on way to understand $V_s/V_p = N_s/N_p$.

---

## 🚀 How to Run
1. Clone the repo: `git clone ...`
2. Install dependencies: `npm install`
3. Start the dev server: `npm start`

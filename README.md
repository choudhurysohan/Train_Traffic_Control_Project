# Train Traffic Control for Section Throughput Optimization

A modern, clean, and professional **React.js Dashboard UI** created for a College Major Project in Railway Automation & Traffic Optimization.

---

## 📁 Project Structure

```
Train_Traffic_Control_Project/
├── index.html            # 🚀 Double-click to run immediately in any browser!
├── standalone.html       # Standalone backup (React 18 in-browser)
├── package.json          # Node / Vite package configuration
├── vite.config.js        # Vite config
├── tailwind.config.js    # Tailwind control-room theme settings
├── src/
│   ├── data/
│   │   └── dummyData.js  # Separated static data model (ready for backend API)
│   └── ...
└── README.md             # Project documentation
```

---

## ⚡ How to Run

### Method 1: Instant 1-Click Run (No Installation Required)
Simply **double-click** `index.html` inside this folder. It will open directly in Chrome, Edge, or Firefox with full React 18 interactivity!

### Method 2: Standard Vite / Node.js Dev Server (Optional)
If you want to run via Node.js:
```bash
npm install
npm run dev
```

---

## 🚆 Key Features
1. **Top Bar**: Live section clock, status indicator, global search, alert drawer, controller profile.
2. **Dashboard**: 6 Key KPI cards, corridor snapshot, alert feed, and top active trains.
3. **Railway Section**: Interactive SVG track schematic with stations, UP/DN mainlines, Loop sidings, signals, and trains.
   - 🟢 **Green** = Normal
   - 🟡 **Yellow** = Warning
   - 🔴 **Red** = Critical
   - 🔵 **Blue** = Active
4. **Train Monitoring**: Multi-category filterable data table with speed gauges and delay indicators.
5. **Track Status**: Capacity load and occupancy for 8 block sections.
6. **Signal Status**: 3-aspect/4-aspect signal aspect lamps with interlocking telemetry.
7. **Train Schedule**: Timetable with platform allocation and arrival/departure variance.
8. **Traffic Control**: Headway spacing, congestion level, and section bottleneck resolutions.
9. **Performance**: High-res SVG analytics charts for throughput and delay curves.
10. **Alerts Log**: Categorized Critical, Warning, and Info records.

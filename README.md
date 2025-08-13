# Personal Budget Planner

A **Personal Budget Planner** built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.  
This web app lets users **add, edit, delete, and analyze daily transactions** under **Income** and **Expenditure** with a responsive dashboard and charts.

---

## 🚀 Features

### Core
- **Add Transactions** with: Date, Name, Amount, Type (Income/Expenditure)
- **Editable & Deletable** rows in an Excel-like table
- **Tabs/Sections:** Income, Expenditure, and optional **All**
- **Summary/Dashboard:** totals for **Income**, **Expenditure**, **Balance (Income − Expenditure)**
- **Charts:** compare Income vs Expenditure over time (ApexCharts)
- **Persistence:** Zustand store synced to `localStorage` (survives reloads)
- **Responsive UI:** Tailwind-based, mobile & desktop friendly

### Bonus 
- Filters: by date range or search by name
- Categories: e.g., Food, Salary, Rent
- Export to **CSV**
- **Dark mode** via `next-themes`

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Charts:** ApexCharts + react-apexcharts
- **State:** Zustand
- **Icons:** react-icons
- **Theme:** next-themes (dark/light)

---

## 📦 Installation

1) **Clone**
```bash
git clone https://github.com/Muhammed-Salih-PK/budget-planner.git
cd budget-planner 
```
2) **Install**
```bash
npm install
```
3) **Run (development)**
```bash
npm run dev
```
The app will be available at http://localhost:3000
3) **Run (Build & Start (production))**
```bash
npm run build
npm start
```
## 🖥 Usage Guide
- Open Income or Expenditure tab.
- Add transactions using the input form (Date, Name, Amount, Type).
- Edit or delete entries inline in the table.
- View totals and charts in the Dashboard section.
- Toggle Dark Mode using the theme switch.
- Filter by date/name or export data to CSV.

## 💾 Data Persistence
- Transactions are managed with Zustand.
- Data is saved to localStorage so it survives browser reloads.
- No backend or database is required.

## 👤 Author

**Muhammed Salih**  

- GitHub: [@Muhammed-Salih-PK](https://github.com/Muhammed-Salih-PK)  
- LinkedIn: [Muhammed Salih](https://www.linkedin.com/in/mhdsalihpk)

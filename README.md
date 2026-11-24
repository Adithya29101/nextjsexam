# Personal Expense Tracker

A full-stack expense tracker built with **Next.js App Router**, **MongoDB**, **Mongoose**, **Axios**, **React Hooks**, and **Tailwind CSS**.

## Features

- Create, read, update, and delete expenses
- Search by expense title or description
- Filter by category, payment method, and date (Today / This Week / This Month)
- Combine search and filters
- Live summary: total expenses, total spent, highest expense, average expense
- Client-side and server-side validation
- Responsive dashboard UI
- Success, error, and delete-confirmation feedback

## Pages

| Route | Purpose |
| --- | --- |
| `/dashboard` | Expense list, filters, search, and summary |
| `/dashboard/add` | Add a new expense |
| `/dashboard/edit/[id]` | Edit an existing expense |

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/expenses` | List expenses with search/filter query params |
| `POST` | `/api/expenses` | Create an expense |
| `GET` | `/api/expenses/[id]` | Get one expense |
| `PUT` | `/api/expenses/[id]` | Update an expense |
| `DELETE` | `/api/expenses/[id]` | Delete an expense |
| `GET` | `/api/expenses/summary` | Get dashboard statistics |

## Setup

### 1. Requirements

- Node.js 20.9 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Copy `.env.example` to `.env.local` and set your connection string:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
```

For MongoDB Atlas:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/expense_tracker?retryWrites=true&w=majority
```

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). It redirects to `/dashboard`.

### 5. Check the MongoDB connection

```bash
npm run check:db
```

This prints the connected host, database name, collections, and expense count.

### 6. Production build

```bash
npm run build
npm start
```

## Validation rules

- Title, description, amount, category, date, and payment method are required.
- Amount must be a positive number.
- Category must be one of: Food, Transportation, Shopping, Entertainment, Healthcare, Education, Others.
- Payment method must be one of: Cash, Credit Card, Debit Card, UPI, Net Banking.

## Project structure

```text
src/
├── app/
│   ├── api/expenses/          # CRUD + summary API routes
│   ├── dashboard/             # Dashboard, add, and edit pages
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Redirects to /dashboard
├── components/                # Reusable UI components
├── lib/                       # DB connection, model, validation, helpers
└── types/                     # Shared TypeScript types
```

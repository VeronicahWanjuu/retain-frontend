# PesaSave (Retain frontend)

A budget and expense tracker for Kenyan university students. Add what you spend in KES, set a monthly budget, and watch the bar go green, then orange, then red.

**Live app:** (add your Vercel URL here)
**Live API:** (add your Render URL here)
**Backend repo:** https://github.com/VeronicahWanjuu/retain-backend
**Frontend repo:** https://github.com/VeronicahWanjuu/retain-frontend

## Grader login

| Role  | Username | Password |
|-------|----------|----------|
| Admin | `admin`  | (your ADMIN_PASSWORD) |
| User  | Sign up on the register page, it takes 10 seconds | |

Note: the free Render server sleeps when nobody uses it. The first request can take up to a minute. Please wait and refresh once.

## What it does

**For students**
- Sign up, sign in, sign out
- Add, view, edit and delete expenses (title, amount, category, date, M-Pesa / cash / card / bank / other, notes)
- Search by title, filter by category, payment method, date range and amount range, sort by date or amount, and page through results
- Set a monthly budget. The bar is green, turns orange from 80%, and red at 100%
- Dashboard for any month: spent, remaining, budget status, biggest expense, spending by category, recent expenses
- Dark mode (remembered next time you open the app)

**For admins**
- Add, rename and delete categories. Deleting a category moves its expenses to "Uncategorized", and "Uncategorized" itself can't be deleted
- Platform insights: total users, total expenses, total money tracked, top categories and more

**Everywhere**
- Loading, empty and error states, a mobile menu, and a 404 page

## Tech

| Part | What I used |
|------|-------------|
| Framework | React 19, TypeScript, Vite |
| Auth (sign up, sign in, roles, protected routes) | React Context |
| Filtering, search, sort, page | Redux Toolkit |
| Routing | React Router 7 |
| UI | Material UI 7 (light and dark theme) |
| API calls | Axios (adds the token and refreshes it on a 401) |
| Tests | Vitest |
| Hosting | Vercel (frontend), Render (backend) |

## How the requirements are met

| Requirement | Where to look |
|-------------|---------------|
| Auth with Context only | `src/context/AuthContext.tsx` |
| Protected and admin routes | `src/components/layout/ProtectedRoute.tsx`, `AdminRoute.tsx` |
| Filtering, search, sort with Redux only | `src/store/slices/expenseSlice.ts`, `src/components/FilterBar.tsx` |
| Expense CRUD | `src/pages/user/Expenses.tsx`, `ExpenseFormDialog.tsx`, `ExpenseDetail.tsx` |
| Monthly budget and bar | `src/pages/user/Budget.tsx`, `src/components/BudgetBar.tsx` |
| User dashboard | `src/pages/user/Dashboard.tsx` |
| Admin dashboard and categories | `src/pages/admin/` |
| Unit tests | `src/utils/helpers.test.ts`, `src/store/slices/expenseSlice.test.ts` |

## Project structure

```
src/
  api/          axios.ts              one axios instance, token + refresh logic
  context/      AuthContext.tsx       who is logged in, and their role
  store/        store.ts, hooks.ts, slices/expenseSlice.ts
  components/   StatCard, BudgetBar, MonthPicker, ConfirmDialog,
                FilterBar, ExpenseCard, ExpenseFormDialog, layout/
  pages/        auth/, user/, admin/, NotFound.tsx
  utils/        helpers.ts            KES formatting, budget colours, error text
  types/        types.ts              shapes of the API data
  theme.ts      light and dark green theme
  App.tsx       routes and providers
  main.tsx      entry point
```

## Run it locally

You need Node 20+ and the backend running (see the backend README).

```
git clone https://github.com/VeronicahWanjuu/retain-frontend.git
cd retain-frontend
npm install
npm run dev
```

Open http://localhost:5173

The app talks to `http://127.0.0.1:8000/api` by default. To point it somewhere else, create a `.env` file in the project root:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

### Other commands

| Command | What it does |
|---------|--------------|
| `npm test` | Runs the 8 unit tests |
| `npm run build` | Type-checks and builds for production |
| `npm run lint` | Runs ESLint |

## Tests

Run `npm test`. You should see:

```
Test Files  2 passed (2)
     Tests  8 passed (8)
```

They cover the budget colour rules (green, orange, red at the right percentages), KES formatting, and the Redux filter slice (setting filters, resetting to page 1 when a filter changes, clearing everything).

## Manual test checklist

| # | Try this | You should see |
|---|----------|----------------|
| 1 | Register with a weak password | A clear error from the server |
| 2 | Register with a good password | You land on the dashboard |
| 3 | Open `/admin` as a normal user | You are sent back to the dashboard |
| 4 | Log out, then open `/expenses` | You go to login, and after login you come back to `/expenses` |
| 5 | Add an expense of KES 500 | It appears in the list and the dashboard total goes up |
| 6 | Add an expense with amount 0 | A validation error, nothing saved |
| 7 | Set a budget of KES 1,000 and spend 500 | Bar is green, "within budget" |
| 8 | Spend 850 in total | Bar turns orange, "approaching" |
| 9 | Spend 1,000 or more | Bar turns red, "over budget" |
| 10 | Search for part of a title | The list narrows and goes back to page 1 |
| 11 | Filter by category, then payment method | Results match both |
| 12 | Sort by amount, high to low | Biggest expense first |
| 13 | Edit an expense | The change shows straight away |
| 14 | Delete an expense | A confirm box appears, then it is removed |
| 15 | Switch to dark mode and refresh | Dark mode is still on |
| 16 | Log in as admin, add a category | It shows in the expense form dropdown |
| 17 | Delete a category that has expenses | Those expenses now show "Uncategorized" |
| 18 | Try to delete "Uncategorized" | Not allowed |
| 19 | Open the admin dashboard | Platform insights load |
| 20 | Open a made-up URL | The 404 page |
| 21 | Log in as a second user | You see none of the first user's expenses |

## Deploy (Vercel)

1. Push the repo to GitHub.
2. On vercel.com choose **Add New, Project**, then import `retain-frontend`.
3. Framework preset: **Vite**. Build command `npm run build`, output folder `dist`.
4. Add an environment variable `VITE_API_URL` with the value `https://YOUR-RENDER-APP.onrender.com/api`.
5. Click **Deploy**.
6. Copy the Vercel URL, then add it to the backend's `CORS_ORIGINS` and `CSRF_ORIGINS` on Render and redeploy the backend.

`vercel.json` rewrites every route to `index.html`, so refreshing on a page like `/expenses` works instead of showing a 404.

## Why I built it


I built PesaSave because most students I know run out of money before the month ends and only find out when M-Pesa says so. I wanted something simple that shows you early, with KES and M-Pesa as the default instead of a US-style app.

The part I found hardest was keeping the filters, search and page number in sync. Changing any filter has to send you back to page 1, or you end up on an empty page 4. Putting it all in one Redux slice fixed that.

One bug I fixeD, when the access token expired the app just kicked people out. I added an Axios interceptor that quietly gets a new token and retries the request.

Next I would add spending charts, recurring expenses (like rent and data bundles) and CSV export.

## Screenshots

(Add 3 screenshots in a `screenshots` folder, then link them like this.)

![Dashboard](screenshots/dashboard.png)
![Expenses](screenshots/expenses.png)
![Admin](screenshots/admin.png)
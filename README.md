
# 🏥 Dezy Clinic — AI Assistant & Dashboard

A smart, text-based AI assistant and dashboard for **Dezy Clinic**, a plastic surgery clinic.

---

## ✨ Features

- 💬 **Text-Based AI Chat Assistant** powered by OpenAI:
  - Book appointments
  - Reschedule appointments
  - Cancel appointments
  - Check doctor availability
  - Provide doctor information

- 📅 **Google Calendar Integration**:
  - Real-time appointment syncing
  - Timezone-aware scheduling (Asia/Kolkata)

- 📊 **Dashboard**:
  - Total agent interactions (calls)
  - Total appointments booked
  - Visual calendar of booked slots for each doctor

---

## 🧑‍⚕️ Doctors Available

- **Dr. Jason P. Matthew** — Rhinoplasty, Facelift, Lip Fillers  
- **Dr. Elizabeth Sorkin** — Tummy Tuck, Upper Arm Lift

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Next.js Serverless API Routes
- **AI:** OpenAI GPT-4o-mini with Function Calling
- **Calendar Integration:** Google Calendar API
- **Data Storage:** JSON file (local)
- **UI Libraries:** React Big Calendar, Moment.js

---

## 🧪 Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/dezy-clinic-ai.git
cd dezy-clinic-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file:

```
OPENAI_API_KEY=your_openai_key
```

### 4. Google Calendar Setup

- Add `service-account.json` in `src/config/`
- Share doctor calendars with the service account email

### 5. Run the app

```bash
npm run dev
```

Visit: http://localhost:3000

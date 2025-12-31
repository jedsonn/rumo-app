# RUMO PROJECT - ABSOLUTE RULES

## 🚨 CRITICAL: THE TEMPLATE IS LAW

You are working on **Rumo**, a goal tracking app. There is a **CANONICAL TEMPLATE** (TEMPLATE.html) that must be followed EXACTLY. Any deviation is a FAILURE.

### THE GOLDEN RULE
**When in doubt, match the template EXACTLY. Do not "improve." Do not "modernize." Do not "simplify."**

---

## 📁 PROJECT STRUCTURE

```
/
├── CLAUDE.md (this file - READ FIRST ALWAYS)
├── TEMPLATE.html (THE SOURCE OF TRUTH - NEVER DELETE)
├── src/
│   ├── app/ (Next.js App Router)
│   ├── components/ (MUST match template components exactly)
│   └── lib/ (Supabase client, utilities)
├── supabase/
│   └── migrations/ (SQL migrations - SHOW ME FIRST)
└── public/
```

---

## ⛔ FORBIDDEN ACTIONS

1. **NEVER** change the visual design without explicit approval
2. **NEVER** rename components differently than the template
3. **NEVER** remove features that exist in TEMPLATE.html
4. **NEVER** add new dependencies without asking
5. **NEVER** "refactor" or "clean up" working code
6. **NEVER** change the color scheme (blue/rose themes)
7. **NEVER** modify the data structure without migration plan
8. **NEVER** write more than 50 lines without stopping for review

---

## ✅ REQUIRED WORKFLOW

### Before EVERY change:
1. State which TEMPLATE.html component you're touching
2. Quote the relevant template code
3. Explain the EXACT change (not "improvements")
4. Wait for approval

### For database changes:
1. Show SQL migration FIRST
2. Show TypeScript types SECOND
3. Show RLS policies THIRD
4. Wait for approval before implementing

### For component changes:
1. Show the TEMPLATE.html version
2. Show your proposed React/Next.js version
3. Highlight ANY differences
4. Wait for approval

---

## 🎨 DESIGN SPECIFICATIONS (FROM TEMPLATE)

### Color System - DO NOT CHANGE
```javascript
// Theme toggle: isBlue ? 'blue' : 'rose'
const themeColor = isBlue ? 'blue' : 'rose';

// Dark mode colors
isDark ? 'bg-slate-900' : (isBlue ? 'bg-blue-50/50' : 'bg-rose-50/50')

// Status colors (EXACT - do not modify)
const statusColors = {
  'Doing': isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700',
  'On Track': isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
  'For Later': isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600',
  'Done': 'bg-green-500 text-white' / 'bg-green-600 text-white',
  'Dropped': isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-600',
};

// Period colors (EXACT)
const periodColors = {
  'One-year': 'sky',
  'Three-years': 'amber',
  'Five-years': 'violet',
};
```

### Component Names - MUST MATCH
- `GoalCard` - single goal item
- `GoalList` - list container with stats header
- `StatusBadge` - tap-to-cycle status
- `PeriodBadge` - tap-to-cycle period (1yr/3yr/5yr)
- `EditableNumber` - goal number with arrows
- `BlessingsList` - blessings tab
- `RewardsList` - rewards tab
- `Toast` - undo notifications
- `ReviewModal` - year in review
- `StatsModal` - stats dashboard
- `EditModal` - goal editor
- `LinkRewardModal` - link reward to goal
- `SuggestionsModal` - AI suggestions
- `ImportModal` - CSV import
- `ResizableDivider` - drag to resize columns
- `CountdownRing` - 10s timer animation for Done

### Data Structure - EXACT SCHEMA
```typescript
interface Goal {
  id: number;
  number: number;
  year: number;
  goal: string;
  period: 'One-year' | 'Three-years' | 'Five-years';
  category: 'Personal' | 'Professional';
  status: 'Doing' | 'On Track' | 'For Later' | 'Done' | 'Dropped';
  action: string;
  cost: number;
  notes: string;
  subtasks: any[];
  pinned: boolean;
  linkedRewardId?: number;
}

interface Blessing {
  id: number;
  text: string;
  date: string;
  category: string;
}

interface Reward {
  id: number;
  text: string;
  cost: number;
  earned: boolean;
}
```

---

## 🔧 TECH STACK

- **Frontend**: Next.js 14+ (App Router)
- **Backend**: Supabase (Auth, Database, RLS)
- **Styling**: Tailwind CSS (classes from template)
- **Icons**: Lucide React
- **Animations**: CSS only (slide-up, countdown-ring)
- **Confetti**: canvas-confetti
- **Deployment**: Vercel

### Supabase Tables (to be created)
```sql
-- ALWAYS show migrations before running

-- goals table
CREATE TABLE goals (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  goal TEXT NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('One-year', 'Three-years', 'Five-years')),
  category TEXT NOT NULL CHECK (category IN ('Personal', 'Professional')),
  status TEXT NOT NULL DEFAULT 'Doing' CHECK (status IN ('Doing', 'On Track', 'For Later', 'Done', 'Dropped')),
  action TEXT DEFAULT '',
  cost DECIMAL(10,2) DEFAULT 0,
  notes TEXT DEFAULT '',
  subtasks JSONB DEFAULT '[]',
  pinned BOOLEAN DEFAULT FALSE,
  linked_reward_id BIGINT REFERENCES rewards(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- blessings table
CREATE TABLE blessings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  text TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT DEFAULT 'Personal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- rewards table
CREATE TABLE rewards (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  text TEXT NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own blessings" ON blessings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own rewards" ON rewards FOR ALL USING (auth.uid() = user_id);
```

---

## 📋 FEATURE CHECKLIST (from template)

### Must Have - Exactly as Template
- [ ] Two-column layout (Personal | Professional) with resizable divider
- [ ] Dark mode toggle
- [ ] Blue/Rose theme toggle
- [ ] Status filter (All/Active/Done)
- [ ] Period filter (All/1yr/3yr/5yr)
- [ ] Search bar
- [ ] Year selector in header
- [ ] Owner name in header (editable)
- [ ] Goal cards with: number, title, cost, period badge, status badge
- [ ] Tap-to-cycle status and period
- [ ] Pin goals (🔥 emoji, stays at top)
- [ ] 10-second delay before Done goals move to bottom
- [ ] Confetti on goal completion
- [ ] Blessings tab with gratitude entries
- [ ] Rewards tab with earned/not-earned toggle
- [ ] Link rewards to goals
- [ ] Stats dashboard modal
- [ ] Year in Review modal
- [ ] Import CSV modal
- [ ] Suggestions modal (sparkles button)
- [ ] Undo toast for deletions
- [ ] Export JSON
- [ ] Clear all (with confirmation)

---

## 🛑 STOP AND ASK IF:

1. You're about to create a new file
2. You're about to install a new package
3. You're about to modify the database schema
4. You're unsure if something matches the template
5. You've written more than 50 lines of code
6. The user's request seems to conflict with the template

---

## 📝 HOW TO RESPOND TO REQUESTS

### User says: "Add feature X"
You say:
```
I'll add [feature X]. Let me check the template first.

**Template reference:** [quote relevant section or say "not in template"]

**My plan:**
1. [Step 1]
2. [Step 2]

**Files I'll touch:**
- [file1]
- [file2]

**Shall I proceed?**
```

### User says: "Fix bug Y"
You say:
```
I see the issue. Here's what's happening:

**Current behavior:** [what's wrong]
**Expected (per template):** [what template does]

**Minimal fix:**
[show the exact lines to change]

**This change affects:** [list any side effects]

**Shall I proceed?**
```

---

## 🎯 SUCCESS CRITERIA

A change is successful ONLY if:
1. It matches the template's visual appearance
2. It matches the template's behavior
3. It doesn't break existing features
4. It uses the exact same naming conventions
5. It uses the exact same color values
6. The user explicitly approves it

---

## REMEMBER

**The template is not a suggestion. It is the specification.**

When the template does something a certain way, that IS the correct way. Do not question it. Do not improve it. MATCH IT.


# Team Tenacious Field Trainer Progression & Accountability Web App

A mobile-first web application for tracking sales representative progression through a 13-step onboarding process.

## 🚀 Quick Start

This is version 1 (V1) - a frontend-only application using local state and dummy JSON data.

### Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:8080`

### Demo Access

- **Trainer View:** Click "Continue with Google" (uses mock authentication)
- **Admin View:** Click "Demo as Admin"

## 📱 Features

### ✅ Implemented in V1
- **Google Sign-In Stub** - Mock authentication with role-based access
- **13-Step Progression Checklist** - Complete checklist system with sub-tasks
- **Trainer Dashboard** - View assigned reps, progress tracking, add new reps
- **Admin Dashboard** - Overview of all reps, funnel metrics, trainer performance
- **Mobile-First Design** - Responsive design optimized for mobile devices
- **Local State Management** - All data stored locally with dummy JSON
- **Progress Tracking** - Visual progress indicators and completion tracking
- **Audit Trail** - Track who completed tasks and when

### 🔄 Future Integrations (Placeholder Functions Ready)
- **EZTexting Integration** - Milestone-based SMS notifications
- **Zapier Automation** - Drip campaigns and stuck rep alerts
- **Database Integration** - Easy swap from local JSON to real database

## 🏗️ Architecture

### Folder Structure
```
/src
  /components
    - Auth.jsx              # Authentication component
    - Checklist.jsx         # 13-step progression checklist
    - RepCard.jsx          # Representative card component
    - TrainerDashboard.jsx  # Trainer's main dashboard
    - AdminDashboard.jsx    # Admin overview dashboard
    - AddNewRep.jsx        # Add new representative form
  /data
    - dummyReps.json       # Sample representative data
    - dummyTrainers.json   # Sample trainer data
    - progressionSteps.json # 13-step progression definition
  /services
    - auth.js              # Authentication service (mock)
    - zapierPlaceholder.js # Future automation integrations
```

### Data Model

**Representative Object:**
```json
{
  "id": "rep-001",
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "(555) 123-4567",
  "fieldTrainerId": "trainer-001",
  "stage": 7,
  "promotionDate": "2024-01-15T10:00:00Z",
  "milestones": [
    {
      "stepId": 1,
      "title": "IBA DAY",
      "completed": true,
      "completedAt": "2024-01-15T10:00:00Z",
      "subTasks": [
        {
          "taskId": "task-001",
          "description": "Complete HR Paperwork",
          "completed": true,
          "completedAt": "2024-01-15T10:00:00Z",
          "completedBy": "trainer-001"
        }
      ]
    }
  ]
}
```

**Field Trainer Object:**
```json
{
  "id": "trainer-001",
  "name": "Grace Lee",
  "email": "grace.lee@teamtenacious.com",
  "role": "trainer",
  "assignedRepIds": ["rep-001", "rep-002"]
}
```

## 🔌 Integration Points

### Swapping to Real Database

1. **Replace JSON imports** in `src/pages/Index.tsx`:
   ```javascript
   // Replace these imports
   import dummyRepsData from '../data/dummyReps.json';
   import dummyTrainersData from '../data/dummyTrainers.json';
   
   // With API calls
   import { fetchReps, fetchTrainers } from '../services/api';
   ```

2. **Update state management** to use API calls instead of local state
3. **Add error handling** and loading states for API interactions

### EZTexting Integration

Located in `src/services/zapierPlaceholder.js`:

```javascript
// TODO: Replace webhook URL with your EZTexting integration
const webhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_USER_ID/MILESTONE_HOOK_ID/';

export const triggerMilestoneText = async (repId, milestone, phoneNumber) => {
  // Implementation ready - just add your webhook URL
};
```

### Zapier Automation

Three automation triggers are ready for implementation:

1. **Milestone Notifications** - `triggerMilestoneText()`
2. **Drip Campaigns** - `triggerDripCampaign()`
3. **Stuck Rep Alerts** - `triggerStuckRepAlert()`

## 📋 13-Step Progression Process

1. **IBA DAY** - Initial onboarding and setup
2. **A PHONE FOLLOW-UP** - Product training and shadowing
3. **B ZOOM FOLLOW-UP** - Systems training and role-play
4. **C ZOOM FOLLOW-UP** - Advanced sales techniques
5. **ATTEND** - Company events and meetings
6. **MARKET APPTS** - Market appointments
7. **CLOSED** - First successful sale
8. **BECOMING NEW PRESENTER** - Presentation skills
9. **ATTEND** - Regular attendance requirements
10. **PROMOTION** - Qualify for promotion
11. **ATTEND** - Senior level responsibilities
12. **LIFE LICENSED** - Insurance licensing
13. **CLOSED 3 CLIENT EXPERIENCES** - Advanced client work

## 🎯 Success Metrics

- **Rep Progress Tracking** - Visual progress through 13 steps
- **Trainer Performance** - Average promotion rates and rep progress
- **Funnel Analytics** - Overall completion rates and bottlenecks
- **Mobile Optimization** - Touch-friendly interface for field use

## 🚀 Deployment

The application is ready for deployment to any static hosting service:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## 🔧 Customization

### Adding New Progression Steps

Edit `src/data/progressionSteps.json` to modify the 13-step process:

```json
{
  "stepId": 14,
  "title": "NEW STEP",
  "description": "Description of the new step",
  "subTasks": [
    "First sub-task",
    "Second sub-task"
  ]
}
```

### Modifying User Roles

Update `src/services/auth.js` to add new user roles or modify permissions.

## 📞 Support

For questions about implementation or customization, refer to the TODO comments throughout the codebase which indicate areas ready for future enhancement.

---

**Built for Team Tenacious** - Empowering field trainers with simple, effective progression tracking.

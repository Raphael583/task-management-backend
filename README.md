

#  Task Management System – Backend (NestJS + MongoDB + AI)

This repository contains the **backend implementation** of a Task Management System that supports both **manual task operations** and **natural-language task commands via an AI assistant**.

The system is designed with a strong focus on:

* Clear separation of concerns
* Centralized business logic
* Predictable task state transitions
* Safe and controlled AI integration

---

##  Core Features

* Create, view, update, and delete tasks
* Enforce strict task state transitions
* Filter tasks by their current state
* Accept natural-language commands through an AI interface
* Ensure AI never bypasses validation or business rules

---

##  Task Model & State Design

Each task contains the following fields:

| Field | Type   | Description            |
| ----- | ------ | ---------------------- |
| id    | string | Unique task identifier |
| title | string | Task title             |
| state | enum   | Current task state     |

### Allowed Task States (Mandatory)

The system uses **exactly** the following task states:

1. **Not Started**
2. **In Progress**
3. **Completed**

These states are defined using a centralized enum.

---

##  State Transition Rules

Task state transitions are **strictly controlled** and enforced only in the service layer.

### Valid transitions:

* `Not Started → In Progress`
* `In Progress → Completed`

### Invalid transitions:

* Skipping states (e.g., `Not Started → Completed`)
* Reverting states (e.g., `Completed → In Progress`)

Any invalid transition is **gracefully rejected** with a clear error message.

> State transition logic is **never implemented** in the UI or AI code.

---

##  AI Integration Design

### Purpose of AI

AI is used **only as an input and intent-interpretation layer**.

It does **not**:

* Directly access the database
* Contain business logic
* Perform state transitions
* Bypass validations

All AI-derived actions pass through the **same service methods** as manual API requests.

---

### How AI Commands Are Processed

1. User sends a natural-language command
   Example:

   * “Add a task to prepare presentation”
   * “Show all completed tasks”

2. The AI layer interprets the intent and converts it into a **structured action**

3. The structured action is validated and executed using existing business logic

4. The response is returned as a status message and/or result

---

### Supported AI Actions

| Action            | Description                   |
| ----------------- | ----------------------------- |
| CREATE_TASK       | Create a new task             |
| UPDATE_TASK_STATE | Move task to next valid state |
| SHOW_TASKS        | View all or filtered tasks    |

---

### Handling Ambiguous or Invalid Commands

* If no task matches → error is returned
* If multiple tasks match → user is asked to be more specific
* If command intent is unclear → AI gracefully rejects the request

---

##  AI Model

* **Google Gemini API**
* Used only for intent interpretation
* API key is stored securely using environment variables

> The backend remains fully functional even if the AI module is removed.

---

##  Database Choice

### Database Used: **MongoDB**

**Reasoning:**

* Flexible schema for rapid iteration
* Natural fit for document-based task storage
* Easy integration with NestJS using Mongoose

### Collections

* `tasks` – stores task documents
* No AI-specific data is stored in the database

---

##  Architecture Overview

```
Controller → Service → Database
             ↑
            AI
```

* Controllers handle HTTP requests
* Services contain all business logic
* AI only generates structured commands
* Database access is isolated to services

---

##  Authentication

Basic authentication support is designed to be easily added if required.
For this task, authentication is kept minimal to focus on core system behavior.

---

##  Running the Backend Locally

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB (local or cloud)

### Setup

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/task-management
GEMINI_API_KEY=your_api_key_here
```

### Start the server

```bash
npm run start:dev
```

The backend runs on:

```
http://localhost:3000
```

---

## 🔗 Frontend Repository

The frontend for this project is maintained separately:

 **Frontend Repository:**
[https://github.com/Raphael583/Task-Management-Frontend](https://github.com/Raphael583/Task-Management-Frontend)

---

##  Key Design Decisions

* Business logic is centralized and reusable
* AI is treated as an untrusted input layer
* State transitions are deterministic and enforced
* Clear separation between data, logic, and AI
* System remains functional without AI

---

##  Submission Notes

* `node_modules` and `.env` are excluded from the repository
* AI usage is transparent and controlled
* Code is structured for clarity and maintainability

---

##  Author

**Raphael A.**
M.Sc. Computer Science
Loyola College, Madras University


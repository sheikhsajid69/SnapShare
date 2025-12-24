# SnapShare 

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**SnapShare** is a modern, responsive web application designed for seamless image sharing and management. Built with performance and user experience in mind, it leverages the power of React, Vite, and Supabase to provide a fast and secure platform for your visual content.

---

## 📖 Table of Contents
- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [Contact](#-contact)

---

## 🚀 About The Project

SnapShare aims to simplify the way users upload, view, and share images. Whether you are building a personal portfolio, a social feed, or a private gallery, SnapShare provides the robust foundation needed for handling media assets efficiently.

The project utilizes **Lovable** for rapid UI iteration and **Supabase** for a scalable backend-as-a-service (BaaS) solution.

---

## ✨ Features

* **⚡ Blazing Fast Performance:** Powered by Vite for instant server start and lightning-fast HMR (Hot Module Replacement).
* **🔒 Secure Authentication:** Integrated Supabase Auth for robust user management.
* **📂 Cloud Storage:** Efficient image upload and retrieval using Supabase Storage buckets.
* **🎨 Modern UI/UX:** Beautifully designed components using **shadcn/ui** and **Tailwind CSS**.
* **📱 Fully Responsive:** Optimized for desktops, tablets, and mobile devices.
* **🛡️ Type Safety:** Built entirely with TypeScript for better code quality and maintainability.

---

## 🛠 Tech Stack

This project is built using the following technologies:

* **Frontend Framework:** [React](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
* **State Management:** [TanStack Query](https://tanstack.com/query/latest) (likely used for data fetching)

---

## 🏁 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

* **Node.js** (v18 or higher recommended)
* **npm** or **bun** package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sheikhsajid69/SnapShare.git](https://github.com/sheikhsajid69/SnapShare.git)
    cd SnapShare
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

### Environment Variables

To run this project, you will likely need to configure Supabase credentials. Create a `.env` file in the root directory and add the following keys (you can get these from your Supabase dashboard):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

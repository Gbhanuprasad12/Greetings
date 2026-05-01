# Greetings App

A personalized greeting card application where users can create customized templates by layering their name and profile picture on beautiful background images.

## Features

- **Authentication**: Simple guest/Google-like login flow that captures name and profile picture.
- **Categorized Templates**: Browse templates by categories like Birthday, Anniversary, Festivals, etc.
- **Live Preview**: See your profile picture and name superimposed directly onto the templates in real-time.
- **Customization**: Users can choose between various categories (Birthdays, Anniversaries, Festivals, etc.) and personalize cards with their own text.
- **Sharing & Downloading**: Allows users to convert the customized template into an actual image (`png`) to download or share using the Native Share API.

## 🚀 Live Demo
You can view the live application here: **[https://greetings-bl0b.onrender.com](https://greetings-bl0b.onrender.com)**

## Built With

- **React** (Vite)
- **React Router Dom** for navigation
- **html-to-image** for rendering DOM nodes into downloadable images
- **Lucide React** for icons
- **Vanilla CSS** with modern variables for styling

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:5173` (or the port specified in terminal) in your browser.

## Project Structure

- `src/pages`: Contains main route views (Login, Home, Share).
- `src/components`: UI components.
- `src/context`: React Context for state management (`UserContext`).
- `src/data`: Mock template definitions.

## Author

Internship Task

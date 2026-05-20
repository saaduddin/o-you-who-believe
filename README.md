# O You Who Believe

A Next.js application that displays and allows interaction with the specific verses from the Quran starting with "O you who believe" (Ya Ayyuhallazina Amanu).
Powered by the [Quran Foundation API](https://api-docs.quran.foundation).

## Features

- **Quran Foundation API Integration**: Uses the official Quran Foundation API for fetching verses and audio.
- **Authentication**: OAuth2 login via Quran Foundation using `iron-session` for secure, encrypted cookie-based session management.
- **Bookmarks**: Save and manage bookmarked verses.
- **Audio Playback**: Listen to verse recitations.
- **Verse Navigation**: Specific focus on "O you who believe" verses.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A Quran Foundation API Client ID and Secret. You can request access [here](https://api-docs.quran.foundation/request-access).

### Environment Variables

Create a `.env.local` file in the root of the project and add the following variables:

```env
# Quran Foundation API Credentials (Required)
QF_CLIENT_ID=your_client_id
QF_CLIENT_SECRET=your_client_secret

# Environment overrides ('prelive' or 'production', defaults to 'prelive')
QF_ENV=prelive

# Iron Session Secret (Must be exactly or at least 32 characters long)
SESSION_SECRET=your_complex_password_at_least_32_chars_long
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saaduddin/o-you-who-believe.git
   cd o-you-who-believe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Authentication**: OAuth2 (Quran Foundation) + `iron-session`
- **UI**: React 19

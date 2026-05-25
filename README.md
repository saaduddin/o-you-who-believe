# O You Who Believe

An interactive Next.js application designed to help users easily discover, listen to, and reflect upon all the verses in the Quran addressing the believers directly with the phrase "O you who believe".

## About the Project

**What problem does this solve?**
While reading the Quran, specific divine instructions directed at believers ("Ya Ayyuhallazina Amanu") are scattered throughout various chapters. This project solves the problem of finding and focusing on these specific, actionable commands by aggregating them into one easy-to-navigate platform.

**How does this help people engage with the Quran?**
It fosters focused engagement by presenting both the original Arabic text and translations with dedicated audio playback and community reflections. Users can bookmark these specific commandments for later review, encouraging continuous learning and direct application of these verses in their daily lives.

**Primary Audience**
The primary audience includes Muslims seeking to study the specific commandments given to believers, students of knowledge aiming to categorize Quranic instructions, and general readers looking for a focused, thematic approach to interacting with the Quran.

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

# District Clone

A premium, high-performance event discovery and booking mobile application built with **React Native** and **Expo**. This project is a feature-rich clone of the District/district platform, focusing on seamless user experience, interactive seating charts, and modern UI/UX principles.

## 🚀 Features

- **Event Discovery**: Browse upcoming events by category, artist, or location with a polished home screen.
- **Interactive Seating Charts**: Integration with [Seats.io](https://seats.io/) for real-time seat selection and booking.
- **Secure Authentication**: Phone-based authentication with OTP autofill and custom verification flows.
- **Dynamic Search**: Robust search functionality to find events, artists, and venues.
- **Hotlist**: Save your favorite events for quick access later.
- **Artist & Category Pages**: Dedicated sections to explore events based on specific artists or genres.
- **Dark Mode**: Full theme support powered by NativeWind and React Native Reusables.
- **Edge-to-Edge Design**: Optimized for modern devices with transparent status bars and navigation bars.

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 54](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **UI Components**: [React Native Reusables](https://reactnativereusables.com/) (Shadcn-like components for RN)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Seating Charts**: [@seatsio/seatsio-react-native](https://github.com/seatsio/seatsio-react-native)
- **Icons**: [Lucide React Native](https://lucide.dev/)

## 📂 Project Structure

```text
├── app/                  # Expo Router directory (screens and layouts)
│   ├── auth/             # Authentication flow (Login, OTP)
│   ├── booking/          # Seating selection and checkout
│   ├── events/           # Event listing and details
│   └── home/             # Main landing pages
├── components/           # Reusable UI components
│   ├── ui/               # Base primitive components (Buttons, Inputs, etc.)
│   ├── auth/             # Authentication-specific components
│   └── booking/          # Seating chart and booking UI
├── constants/            # API endpoints, theme colors, and static data
├── hooks/                # Custom React hooks
├── services/             # API and third-party service logic
├── store/                # State management (Zustand/Redux)
└── assets/               # Local images, fonts, and icons
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [PNPM](https://pnpm.io/) (Recommended) or NPM/Yarn
- [Expo Go](https://expo.dev/go) app on your physical device for testing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chandani7021/district-event-clone.git
   cd district-clone
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open the app:
   - Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).
   - Press `i` for iOS Simulator or `a` for Android Emulator.

## 📱 Development Builds

For native feature testing (like Seats.io or OTP autofill), a development build is recommended:

### Android Dev Build
```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home pnpm expo run:android
```

### EAS Build (Preview)
```bash
eas build --platform android --profile preview
```

## 📄 License

This project is private and intended for portfolio/demonstration purposes.

---

*Developed with ❤️ as a practice project.*

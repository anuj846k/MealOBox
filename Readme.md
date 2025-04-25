# MealOBox Vendor App

## Overview

MealOBox is a mobile application that connects home chefs with customers seeking authentic homemade meals. This repository contains the vendor-side mobile app built with React Native and Expo, allowing kitchen partners to manage their meal offerings, handle orders, and coordinate deliveries.

## Features

### For Kitchen Partners (Vendors)
- **Kitchen Management**: Toggle kitchen open/closed status
- **Menu Management**: Create and manage different meal types (Breakfast, Lunch, Dinner)
- **Meal Item Management**: Add, edit, and organize individual meal items
- **Delivery Slot Management**: Create time slots for when meals will be available
- **Order Processing**: View and handle customer orders organized by area
- **Transaction History**: Monitor payment information and financial records

### For Delivery Partners
- **Partner Management**: Add and manage delivery personnel
- **Slot Assignment**: Assign delivery partners to specific delivery slots
- **Payment System**: Configure delivery charges and bonus structures

## Tech Stack

- **Frontend Framework**: React Native with Expo
- **State Management**: React Query for server state
- **Navigation**: Expo Router
- **Storage**: AsyncStorage for local data persistence
- **Maps**: Google Maps integration for delivery area management
- **UI Components**: Custom components with Expo Vector Icons
- **Authentication**: JWT-based authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mealobox-vendor-app.git
cd mealobox-vendor-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Run on device or simulator
- Scan the QR code with the Expo Go app (Android)
- Press 'i' to open in iOS simulator or 'a' for Android emulator

## Project Structure

```
mealobox-vendor-app/
├── app/
│   ├── (auth)/           # Authentication screens
│   ├── (screens)/        # Main app screens
│   ├── (tabs)/           # Tab navigation screens
│   ├── api/              # API service functions
│   │   ├── getApi/       # GET requests
│   │   ├── postApi/      # POST requests
│   │   └── updateApi/    # UPDATE requests
│   └── interfaces/       # TypeScript interfaces
├── assets/               # Images and other static assets
├── components/           # Reusable components
│   └── homeComponents/   # Components for home screen
└── constants/            # App constants
```

## Key Screens

- **Home**: Dashboard with kitchen status and activity overview
- **Menu Management**: Create and manage meal offerings
- **Order Management**: Process and assign customer orders
- **Delivery Partner Management**: Add and manage delivery personnel
- **Transactions**: View payment history and settlement details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

For any questions or support, please contact the project maintainers.
# Offline Chat with Bluetooth

## Overview

This project is an offline chat application that can send messages via Bluetooth when the device is offline. It also integrates Firebase for real-time syncing when online. It offers a simple chat interface where users can message contacts. In case of no internet connection, Bluetooth is used to send messages.

## Features

- **Send Messages**: Send messages in real-time.
- **Offline Mode**: If the internet connection is unavailable, the message is sent via Bluetooth.
- **Smart Message Delivery**: UI differentiates between messages sent via network and Bluetooth.
- **Bluetooth Integration**: Uses Bluetooth technology to send messages when no internet is available.
- **Unread Message Count**: Shows a count of unread messages next to contacts.
- **Message Status**: Tracks message status (sending, sent, delivered).
- **Real-time Updates**: Ensures messages are reflected in real-time.
  
## Technologies Used

- **React** for the frontend.
- **Firebase** for real-time database management.
- **Bluetooth API** for offline messaging.
- **Material UI** for design components.
- **Node.js** for backend services (if needed for Bluetooth handling).
- **PWA features** for offline handling.

## How It Works

1. **Message Sending**:
   - The user can type a message in the input field.
   - If the user is online, the message is sent via the Firebase network.
   - If the user is offline, the message is sent via Bluetooth to the recipient.

2. **Bluetooth Communication**:
   - The application detects if the user is offline by checking the network status.
   - If offline, the message is queued and sent when the Bluetooth connection is established.

3. **Real-time Sync**:
   - When the user is online, messages are synced in real-time with Firebase, and the message status updates.

## Installation

To run the application locally, follow these steps:

1. **Clone the repository**:

```bash
git clone https://github.com/dkunze/offline-chat.git
```

2. **Install dependencies**:

```bash
cd offline-chat
yarn install
```

3. **Run the app**:

```bash
yarn start
```

This will start the application on `http://localhost:3000`.

## Future Enhancements

- Improve Bluetooth message handling for different devices.
- Implement better UI/UX for offline mode detection.
- Add user authentication (Firebase Authentication).
- Enhance Bluetooth offline messaging reliability.

## Contributing

We welcome contributions to this project! If you'd like to contribute, please follow these steps:

1. **Fork the repository**.
2. **Create a new branch** for your feature or fix.
3. **Make your changes** and test them.
4. **Submit a pull request** with a description of the changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Firebase** for real-time data sync.
- **Bluetooth API** for offline communication.
- **Material UI** for design components.
- **React** for the frontend framework.
- **emoji-mart** for adding emoji picker functionality.
```

### Instructions:
1. **Copy the content**: Select and copy the entire content above.
2. **Paste into your `README.md`**: Open your existing `README.md` file in your project directory (or create a new one), and paste the content into the file.
3. **Save the file**: Once pasted, save your `README.md` file.
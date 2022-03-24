// @dart=2.9

// * Import modules
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'message.dart';

// Listens for incoming foreground messages.
class MessageList extends StatefulWidget {
  // Set key
  const MessageList({Key key}) : super(key: key);
  @override
  // Create state
  State<StatefulWidget> createState() => _MessageList();
}

// local Message lister
class _MessageList extends State<MessageList> {
  final List<RemoteMessage> _messages = []; // messages array

  @override
  // Initializer
  void initState() {
    // Initialize state
    super.initState();
  }

  // Widget builder
  @override
  Widget build(BuildContext context) {
    // Message is empty
    if (_messages.isEmpty) {
      // Show alert
      return const Text('No messages received');
    }

    return ListView.builder(
        shrinkWrap: true,
        itemCount: _messages.length, // item counter
        itemBuilder: (context, index) {
          final message = _messages[index];

          return ListTile(
            title: Text(message.messageId), // message title
            subtitle:
                Text(message.sentTime?.toString() ?? 'N/A'), // message subtitle
            onTap: () => Navigator.pushNamed(context, '/message', // tapped
                arguments: MessageArguments(message, openedApplication: false)),
          );
        });
  }
}

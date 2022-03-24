// @dart=2.9

// * Import modules
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

/// Message route arguments.
class MessageArguments {
  // constructor
  MessageArguments(this.message, {this.openedApplication})
      : assert(message != null);

  // The RemoteMessage
  final RemoteMessage message;

  // Whether this message caused the application to open.
  final bool openedApplication;
}

// Displays information about a [RemoteMessage].
class MessageView extends StatelessWidget {
  // Set key
  const MessageView({Key key}) : super(key: key);

  // A single data row.
  Widget row(String title, String value) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, right: 8, top: 8), // padding
      child: Row(children: [
        Text('$title: '),
        Text(value ?? 'N/A'),
      ]),
    );
  }

  // Widget builder
  @override
  Widget build(BuildContext context) {
    final args =
        ModalRoute.of(context).settings.arguments as MessageArguments; // args
    final message = args.message; // message
    final notification = message.notification; // notification

    return Scaffold(
      appBar: AppBar(
        title: Text(message.messageId), // title
      ),
      body: SingleChildScrollView(
          child: Padding(
        padding: const EdgeInsets.all(8), // padding
        child: Column(children: [
          row('Triggered application open', args.openedApplication.toString()),
          row('Message ID', message.messageId),
          row('Sender ID', message.senderId),
          row('Category', message.category),
          row('Collapse Key', message.collapseKey),
          row('Content Available', message.contentAvailable.toString()),
          row('Data', message.data.toString()),
          row('From', message.from),
          row('Message ID', message.messageId),
          row('Sent Time', message.sentTime?.toString()),
          row('Thread ID', message.threadId),
          row('Time to Live (TTL)', message.ttl?.toString()),
          if (notification != null) ...[
            Padding(
              padding: const EdgeInsets.only(top: 16),
              child: Column(children: [
                const Text(
                  'Remote Notification',
                  style: TextStyle(fontSize: 18),
                ),
                row(
                  'Title',
                  notification.title,
                ),
                row(
                  'Body',
                  notification.body,
                ),
                if (notification.android != null) ...[
                  const Text(
                    'Android Properties',
                    style: TextStyle(fontSize: 18),
                  ),
                  row(
                    'Channel ID',
                    notification.android.channelId,
                  ),
                  row(
                    'Click Action',
                    notification.android.clickAction,
                  ),
                  row(
                    'Color',
                    notification.android.color,
                  ),
                  row(
                    'Count',
                    notification.android.count?.toString(),
                  ),
                  row(
                    'Image URL',
                    notification.android.imageUrl,
                  ),
                  row(
                    'Link',
                    notification.android.link,
                  ),
                  row(
                    'Priority',
                    notification.android.priority?.toString(),
                  ),
                  row(
                    'Small Icon',
                    notification.android.smallIcon,
                  ),
                  row(
                    'Sound',
                    notification.android.sound,
                  ),
                  row(
                    'Ticker',
                    notification.android.ticker,
                  ),
                  row(
                    'Visibility',
                    notification.android.visibility?.toString(),
                  ),
                ],
                if (notification.apple != null) ...[
                  const Text(
                    'Apple Properties',
                    style: TextStyle(fontSize: 18),
                  ),
                  row(
                    'Subtitle',
                    notification.apple.subtitle,
                  ),
                  row(
                    'Badge',
                    notification.apple.badge,
                  ),
                  row(
                    'Sound',
                    notification.apple.sound?.name,
                  ),
                ]
              ]),
            )
          ]
        ]),
      )),
    );
  }
}

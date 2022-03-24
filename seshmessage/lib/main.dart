// @dart=2.9

// * Import modules
import 'dart:async';
import 'dart:convert';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import 'message.dart';
import 'message_list.dart';
import 'permissions.dart';
import 'token_monitor.dart';

// * Initialization
// Initialize the [FlutterLocalNotificationsPlugin] package on background.
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint('Handling a background message ${message.messageId}');
}

// Create a [AndroidNotificationChannel] for heads up notifications.
const AndroidNotificationChannel channel = AndroidNotificationChannel(
  'high_importance_channel', // id
  'High Importance Notifications', // title
  // 'This channel is used for important notifications.', // description
  importance: Importance.high,
);

// Initialize the [FlutterLocalNotificationsPlugin] package.
final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

// * Main
Future<void> main() async {
  // * Initialization
  // Flutter widget preparation
  WidgetsFlutterBinding.ensureInitialized();
  // Initialize firebase
  await Firebase.initializeApp();

  // * Create an Android Notification Channel.
  // Set the background messaging handler early as a named top-level function
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Use `AndroidManifest.xml` file to override the default FCM channel to enable heads up notifications.
  await flutterLocalNotificationsPlugin
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
      ?.createNotificationChannel(channel);

  // Update the iOS foreground notification presentation options to allow
  // heads up notifications.
  await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
    alert: true,
    badge: true,
    sound: true,
  );

  // Run application
  runApp(const MessagingExampleApp());
}

/// Entry point for the example application.
class MessagingExampleApp extends StatelessWidget {
  // Set key
  const MessagingExampleApp({Key key}) : super(key: key);
  @override
  // Build widget
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Messaging Example App', // title
      theme: ThemeData.dark(), // color theme
      routes: {
        '/': (context) => const Application(), // top
        '/message': (context) => const MessageView(), // message
      },
    );
  }
}

// Crude counter to make messages unique
int _messageCount = 0;

/// The API endpoint here accepts a raw FCM payload for demonstration purposes.
String constructFCMPayload(String token) {
  // Count up
  _messageCount++;
  // returned json
  return jsonEncode({
    'token': token, // token
    'data': {
      'via': 'FlutterFire Cloud Messaging!!!', // header
      'count': _messageCount.toString(), // counter
    },
    'notification': {
      'title': 'Hello FlutterFire!', // notification title
      'body':
          'This notification (#$_messageCount) was created via FCM!', // notification body
    },
  });
}

/// Renders the example application.
class Application extends StatefulWidget {
  // Set key
  const Application({Key key}) : super(key: key);
  @override
  // Return state
  State<StatefulWidget> createState() => _Application();
}

// Local Renderer
class _Application extends State<Application> {
  @override
  // Initializer
  void initState() {
    // Initialize state
    super.initState();
    // Messaging
    FirebaseMessaging.instance.getInitialMessage() // get intial message
        .then((RemoteMessage message) {
      // Message exists
      if (message != null) {
        // Send message
        Navigator.pushNamed(context, '/message',
            arguments: MessageArguments(message, openedApplication: true));
      }
    });

    // Receive message
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      final notification = message.notification; // notification flg
      final android = message.notification?.android; // android exist flg

      // Still not received message and android exists
      if (notification != null && android != null) {
        // Show notification
        flutterLocalNotificationsPlugin.show(
            notification.hashCode, // hash code
            notification.title, // title
            notification.body, // body
            NotificationDetails(
              android: AndroidNotificationDetails(
                channel.id, // channel id
                channel.name, // channel name
                // channel.description, // channel description
                // ignore: flutter_style_todos // channel ignore flg
                icon: 'launch_background', // notification icon
              ),
            ));
      }
    });

    // Background ignititon message app
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      debugPrint('A new onMessageOpenedApp event was published!');
      // Transfer window
      Navigator.pushNamed(context, '/message',
          arguments: MessageArguments(message, openedApplication: true));
    });
  }

  // Option Selection widget
  Future<void> onActionSelected(String value) async {
    // switch
    switch (value) {
      // Subscribe
      case 'subscribe':
        {
          debugPrint(
              'FlutterFire Messaging Example: Subscribing to topic "fcm_test".');
          // Set subscription
          await FirebaseMessaging.instance.subscribeToTopic('fcm_test');
          debugPrint(
              'FlutterFire Messaging Example: Subscribing to topic "fcm_test" successful.');
        }
        break;
      // Unsubscribe
      case 'unsubscribe':
        {
          debugPrint(
              'FlutterFire Messaging Example: Unsubscribing from topic "fcm_test".');
          // Set Unsubscribe
          await FirebaseMessaging.instance.unsubscribeFromTopic('fcm_test');
          debugPrint(
              'FlutterFire Messaging Example: Unsubscribing from topic "fcm_test" successful.');
        }
        break;
      // Default
      default:
        break;
    }
  }

  // * Main widget builder
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // application bar
      appBar: AppBar(
        title: const Text('Cloud Messaging'), // title
        actions: <Widget>[
          PopupMenuButton(
            onSelected: onActionSelected, // selector
            itemBuilder: (BuildContext context) {
              return [
                const PopupMenuItem(
                  value: 'subscribe', // menu
                  child: Text('Subscribe to topic'), // text
                ),
                const PopupMenuItem(
                  value: 'unsubscribe', // selected value
                  child: Text('Unsubscribe to topic'), // text
                ),
              ];
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(children: [
          const MetaCard(
              title: 'Permissions',
              children: Permissions()), // request permission
          MetaCard(
              title: 'FCM Token',
              children: TokenMonitor((token) {
                return token == null
                    ? const CircularProgressIndicator() // wait for loading
                    : Text(token,
                        style: const TextStyle(fontSize: 12)); // display token
              })),
          const MetaCard(title: 'Message Stream', children: MessageList()),
        ]),
      ),
    );
  }
}

// * UI Widget for displaying metadata.
class MetaCard extends StatelessWidget {
  // Constructor
  const MetaCard({Key key, this.title, this.children}) : super(key: key);

  final String title; // title
  final Widget children; // child widget

  // Widget Builder
  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity, // container width
        margin: const EdgeInsets.only(left: 8, right: 8, top: 8), // margin
        child: Card(
            child: Padding(
                padding: const EdgeInsets.all(16), // padding
                child: Column(children: [
                  Container(
                      margin: const EdgeInsets.only(bottom: 16), // margin
                      child: Text(title, style: const TextStyle(fontSize: 18))),
                  children,
                ]))));
  }
}

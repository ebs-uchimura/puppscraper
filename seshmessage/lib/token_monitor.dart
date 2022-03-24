// * Import modules
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

//* Manages & returns the users FCM token.
// Also monitors token refreshes and updates state.
class TokenMonitor extends StatefulWidget {
  // constructor
  const TokenMonitor(this._builder);
  final Widget Function(String token) _builder;

  // Return state
  @override
  State<StatefulWidget> createState() => _TokenMonitor();
}

// Local token monitor
class _TokenMonitor extends State<TokenMonitor> {
  // Initialize variables
  String _token = "";
  Stream<String>? _tokenStream;

  // set token
  void setToken(String token) {
    debugPrint('FCM Token: $token');
    setState(() {
      _token = token; // set to local
    });
  }

  // Initializer
  @override
  void initState() {
    // Initialize state
    super.initState();
    // Get token
    FirebaseMessaging.instance.getToken().then((token) {
      // If not null
      if (token != null) {
        setToken(token); // set token
      }
    });
    _tokenStream = FirebaseMessaging.instance.onTokenRefresh;
    _tokenStream?.listen(setToken);
  }

  // Widget builder
  @override
  Widget build(BuildContext context) {
    return widget._builder(_token);
  }
}

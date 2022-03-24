// @dart=2.9

// * Import modules
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

/// Requests & displays the current user permissions for this device.
class Permissions extends StatefulWidget {
  // Set key
  const Permissions({Key key}) : super(key: key);
  // Create state
  @override
  State<StatefulWidget> createState() => _Permissions();
}

// Local permissioner
class _Permissions extends State<Permissions> {
  bool _requested = false;
  bool _fetching = false;
  NotificationSettings _settings;

  // Request permission
  Future<void> requestPermissions() async {
    setState(() {
      _fetching = true;
    });

    // Request setting
    final settings = await FirebaseMessaging.instance.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    // Set state
    setState(() {
      _requested = true; // request flg
      _fetching = false; // fetch flg
      _settings = settings; // setting flg
    });
  }

  // Widget row
  Widget row(String title, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8), // margin
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('$title:',
              style: const TextStyle(fontWeight: FontWeight.bold)), // text body
          Text(value), // text
        ],
      ),
    );
  }

  // Widget builder
  @override
  Widget build(BuildContext context) {
    final ButtonStyle style =
        ElevatedButton.styleFrom(textStyle: const TextStyle(fontSize: 20));
    if (_fetching) {
      return const CircularProgressIndicator(); // wait for loading
    }

    if (!_requested) {
      return ElevatedButton(
          style: style,
          onPressed: requestPermissions, // request permisison
          child: const Text('Request Permissions'));
    }

    // widget column
    return Column(children: [
      row('Authorization Status', statusMap[_settings.authorizationStatus]),
      ElevatedButton(
        style: style,
        onPressed: () {},
        child: const Text('Reload Permissions'),
      ),
    ]);
  }
}

/// Maps a [AuthorizationStatus] to a string value.
const statusMap = {
  AuthorizationStatus.authorized: 'Authorized',
  AuthorizationStatus.denied: 'Denied',
  AuthorizationStatus.notDetermined: 'Not Determined',
  AuthorizationStatus.provisional: 'Provisional',
};

/// Maps a [AppleNotificationSetting] to a string value.
const settingsMap = {
  AppleNotificationSetting.disabled: 'Disabled',
  AppleNotificationSetting.enabled: 'Enabled',
  AppleNotificationSetting.notSupported: 'Not Supported',
};

/// Maps a [AppleShowPreviewSetting] to a string value.
const previewMap = {
  AppleShowPreviewSetting.always: 'Always',
  AppleShowPreviewSetting.never: 'Never',
  AppleShowPreviewSetting.notSupported: 'Not Supported',
  AppleShowPreviewSetting.whenAuthenticated: 'Only When Authenticated',
};

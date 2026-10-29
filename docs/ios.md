# iOS App

The iOS app is a Capacitor shell that loads the live app at `/chat_mate/app/` (`server.url` in `frontend/capacitor.config.json`); `/chat_mate/` is a landing page that forwards older builds there.
Pushing to `master` updates the app content too; a new App Store / TestFlight build is only needed when the native shell changes (icon, permissions, Capacitor version).

Loading the live site keeps the request origin at `https://morriedig.github.io`, so the Apps Script `ALLOWED_ORIGINS` property does not need a `capacitor://localhost` entry.

## Build

```bash
cd frontend
npm run build && npx cap sync ios
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath build/ChatMate.xcarchive archive \
  DEVELOPMENT_TEAM=<team id> CODE_SIGN_STYLE=Automatic -allowProvisioningUpdates \
  -authenticationKeyPath <.p8 path> -authenticationKeyID <key id> -authenticationKeyIssuerID <issuer id>
```

Team ID and App Store Connect API key values stay outside the repo.

- Bundle ID: `com.morrie.chatmate`
- iPhone only, portrait, iOS 15+
- Capacitor 8+ is required: apps built with the iOS 27 SDK must use the UIScene life cycle (`SceneDelegate.swift`), and the Capacitor 7 template crashes on launch without it
- Native plugins: `@capgo/capacitor-speech-recognition` (speech input; `@capacitor-community/speech-recognition` has no Swift Package support) and `@capacitor-community/text-to-speech`. `src/utils/stt.js` and `tts.js` use them when `Capacitor.isNativePlatform()`; adding or upgrading a plugin needs `cap sync ios` and a new TestFlight build
- The App Store Connect app record has to be created once on the website; the API cannot create it.

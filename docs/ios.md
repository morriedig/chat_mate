# iOS App

The iOS app is a Capacitor shell that loads the live app at `/chat_mate/app/` (`server.url` in `frontend/capacitor.config.ts`, which replaced `capacitor.config.json` so one file can describe both apps); `/chat_mate/` is a landing page that forwards older builds there.
Pushing to `master` updates the app content too; a new App Store / TestFlight build is only needed when the native shell changes (icon, permissions, Capacitor version).

Loading the live site keeps the request origin at `https://morriedig.github.io`, so the Apps Script `ALLOWED_ORIGINS` property does not need a `capacitor://localhost` entry.

## Build

```bash
cd frontend
npm install   # capacitor.config.ts needs the typescript devDependency
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

## Chinese edition (Chat Mate 華語)

A second app for learning Taiwan Mandarin, built from the same repo. It loads `/chat_mate/zh/app/`; the plan is `docs/plans/zh-edition.md`.

- Bundle ID: `com.morrie.chatmate.zh` (its own App Store Connect app record; never upload it to the English one)
- Native project: `frontend/ios-zh/` (a copy of `ios/` with its own bundle ID, display name, usage descriptions and icon); same iPhone-only, portrait, iOS 15+ settings
- `capacitor.config.ts` picks the app from `CHATMATE_EDITION`: unset gives the English config above, `zh` gives the Chinese one (`webDir: dist-zh`, `ios.path: ios-zh`). `VITE_EDITION=zh` makes Vite build the Chinese web app into `dist-zh/`

```bash
cd frontend
CHATMATE_EDITION=zh VITE_EDITION=zh npm run build && CHATMATE_EDITION=zh npx cap sync ios
xcodebuild -project ios-zh/App/App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath build/ChatMateZh.xcarchive archive \
  DEVELOPMENT_TEAM=<team id> CODE_SIGN_STYLE=Automatic -allowProvisioningUpdates \
  -authenticationKeyPath <.p8 path> -authenticationKeyID <key id> -authenticationKeyIssuerID <issuer id>
```

`npx cap sync ios` without `CHATMATE_EDITION=zh` syncs the English project in `ios/`, not `ios-zh/`. Before uploading, check the archive's bundle ID:

```bash
/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' build/ChatMateZh.xcarchive/Products/Applications/App.app/Info.plist
# com.morrie.chatmate.zh
```

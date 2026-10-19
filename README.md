ScanditCaptureCore builds the foundation of all data capture related functionality offered by the Scandit Data Capture SDK. It contains classes and interfaces shared between the data capture modules.

Learn more with the [official documentation](https://docs.scandit.com/) or get started with [our samples](https://github.com/Scandit/datacapture-react-native-samples)

## iOS troubleshooting

### `use_frameworks!` and Expo `useFrameworks: "static"` support

The Scandit SDK builds and runs in every supported React Native iOS configuration without Podfile workarounds, including:

- Default static libraries (no `use_frameworks!`)
- `use_frameworks! :linkage => :dynamic`
- `use_frameworks! :linkage => :static` (required by [`react-native-firebase`](https://rnfirebase.io/))
- Expo apps with `expo-build-properties: ios.useFrameworks: "static"` (RN ≥ 0.83 prebuilt React.xcframework path)

All features — including new-architecture advanced overlays (MatrixScan AR, Smart Label Capture overlays) — work in each of these configurations. No `pod 'React-RCTAppDelegate', :modular_headers => true` declaration or post-install hook is required.

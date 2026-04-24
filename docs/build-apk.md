# Build APK

## Local Build

Requirements:

- JDK 17
- Android SDK with platform/build-tools for API 34
- Network access the first time Gradle downloads dependencies

Run:

```bash
./scripts/build_apk.sh
```

Expected output:

```text
app/build/outputs/apk/debug/app-debug.apk
```

## GitHub Actions

The workflow is `.github/workflows/build.yml`.

It runs on:

- manual dispatch
- pushes to `main`
- pushes to `work`
- pushes to `claude/**`

Artifacts:

- `app-debug-apk`: installable debug APK
- `app-build-dir`: full `app/build` directory for troubleshooting

## Notes

The debug APK is for device testing. Google Play release builds still need a signed release APK/AAB and final Play Console metadata.

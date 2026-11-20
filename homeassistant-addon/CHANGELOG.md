# Changelog

## 1.2.0

- Settings on the add-on's Configuration tab: the app's port, the artwork folder, and optionally this machine's IP address, time zone, default look, image fit, bar color and clock sync. Ones set there show as locked in the app
- The sidebar uses a port Home Assistant picks, so the app's own port can be changed freely
- Built without build.yaml, which the Supervisor no longer recommends

## 1.1.0

- First release as a Home Assistant add-on, with the web app in the sidebar
- Sends that wait for a display that's asleep, and go out as soon as it can be reached
- Images sized to the panel: fit, fill or stretch, in the designer or by default
- Artwork uploads, groups of displays spanning one image, schedules with several times a day
- Display clocks checked and synced on every send

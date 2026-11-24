# Samsung EMDX

The Samsung EMDX web app, run by Home Assistant. Open it from **E-Paper** in the sidebar. Displays, queues and schedules are set up in the app itself; a few app-wide settings can also be set on this add-on's **Configuration** tab.

## First steps

1. Open **E-Paper** in the sidebar.
2. Choose **Add display** and enter its name, IP address and PIN (from the display's network screen). **Scan network** finds displays that are awake.
3. Open the display's settings (the gear) and set **Sleep mode** to **Network standby** and its **MAC address**. Then the app can wake it to send images and run its schedule. In deep sleep, a display only wakes for its power button, so images wait until then.

## Configuration

| Option | | |
| --- | --- | --- |
| **Port** | `3001` | The app's port on this machine. Displays download images from it, and it's the address for a browser, scripts and the integration. Change it if something else uses 3001; the sidebar works whatever it is. |
| **Artwork folder** | `samsung-emdx` | The folder in Home Assistant's media whose subfolders show in the app's library: `/media/<this folder>/<category>/`. |
| **This machine's IP address** | empty | The address displays download images from. Empty: detected automatically. |
| **Time zone** | empty | For scheduled wake times and display clocks, like `America/New_York`. |
| **Default look** | empty | `eink`, `vivid`, `bw` or `none`: the tone for images without one of their own. |
| **Image fit** | empty | `fit`, `fill` or `stretch`: how images without a layout are sized to the panel. |
| **Bar color** | empty | Around a fitted image, like `#000000`. |
| **Keep display clocks in sync** | empty | Sets a display's clock to this machine's time when it's out. |

The optional ones show under **Show unused optional configuration options**. One you set here takes the place of the same setting in the app, which then shows it as set in Home Assistant. Left empty, the app's own Settings decide. Restart the add-on after changing them.

## The app's address

Displays download images straight from this add-on, on its port on the Home Assistant machine (3001 unless you change it). The add-on uses the host's network, so the app finds the machine's address by itself. If it can't, set it here or in the app's Settings → General.

The app is also at `http://<home assistant>:<port>` outside the sidebar, for a phone on the same network or for scripts.

## Artwork

- **Upload** in the app's library keeps artwork with the add-on's data.
- Files you put in `/media/samsung-emdx/<category>/` (or the **Artwork folder** you chose) show in the library too, under their folder's name. Add them with the Samba share, the File editor, or Media → Local media. JPEG, PNG and WebP work.

## The integration

The add-on runs the app. The **Samsung EMDX** integration brings its displays into Home Assistant: battery, awake and delivery sensors, the current image, wake, sleep and next-image buttons, and actions to send an image or span one across a group. Install it as described in the repository's `docs/HOME-ASSISTANT.md`. When it asks for the app's URL, enter this, with your port if you changed it:

```
http://127.0.0.1:3001
```

## Behind a reverse proxy

If you reach Home Assistant through nginx (the **NGINX Home Assistant SSL proxy** add-on, Nginx Proxy Manager and the like), sending an image from the sidebar fails with **Couldn't send: HTTP 413**. The image is uploaded through the proxy, and nginx turns away anything over 1 MB unless told otherwise. Raise its limit to the app's own, 50 MB:

- **NGINX Home Assistant SSL proxy add-on**: on its **Configuration** tab, set `customize` → `active: true` (leave `default` as `nginx_proxy_default*.conf`). Create `/share/nginx_proxy_default.conf` (with the File editor or Samba) containing:

  ```nginx
  client_max_body_size 50M;
  ```

  Then restart the NGINX add-on.
- **Nginx Proxy Manager**: put `client_max_body_size 50M;` in the proxy host's **Advanced** tab.

Opening Home Assistant by its local address (`http://homeassistant.local:8123`) goes around the proxy, so sending works there either way.

## Data and backups

Displays, queues, groups, schedules and uploaded artwork live in the add-on's data and are included in Home Assistant backups. Thumbnails and the depth model used for room photos are a cache that's left out of backups and made again when needed.

## Running it without Home Assistant

It's the same app: `docker compose up -d` in the repository, or `npm run start` in `web/`. A copy running on its own and this add-on keep separate data.

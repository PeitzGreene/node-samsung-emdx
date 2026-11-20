# The Home Assistant add-on: the app's own image, with its data where an
# add-on keeps it. Home Assistant passes the add-on's version (config.yaml)
# as BUILD_VERSION, so the add-on runs the app image published for that
# version (.github/workflows/image.yml publishes one per tag). EMDX_IMAGE
# lets a local test build use another image.
ARG BUILD_VERSION=latest
ARG EMDX_IMAGE=ghcr.io/peitzgreene/node-samsung-emdx
FROM ${EMDX_IMAGE}:${BUILD_VERSION}

LABEL org.opencontainers.image.title="Samsung EMDX add-on" \
      org.opencontainers.image.source="https://github.com/PeitzGreene/node-samsung-emdx"

# Add-on storage (/data, /media) belongs to root
USER root

# /data is kept across updates and included in backups; the cache (thumbnails,
# the depth model) is left out of backups. The add-on page's options are in
# /data/options.json, artwork in /media/<media_folder>.
ENV EMDX_DATA_DIR=/data \
    EMDX_CACHE_DIR=/data/cache \
    EMDX_GALLERY_DIR=/media/samsung-emdx \
    EMDX_OPTIONS_FILE=/data/options.json

# The app's port is an option, so the check reads it from there
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "let p=3001;try{p=JSON.parse(require('fs').readFileSync('/data/options.json','utf8')).port||p}catch{}fetch('http://127.0.0.1:'+p+'/api/server-check').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"

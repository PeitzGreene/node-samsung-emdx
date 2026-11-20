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
# the depth model) is left out of backups. Artwork in /media/samsung-emdx
# shows in the app's library.
ENV EMDX_DATA_DIR=/data \
    EMDX_CACHE_DIR=/data/cache \
    EMDX_GALLERY_DIR=/media/samsung-emdx

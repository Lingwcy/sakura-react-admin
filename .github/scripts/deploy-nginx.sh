#!/usr/bin/env bash
set -Eeuo pipefail

ARCHIVE="${1:?release archive is required}"
RELEASE_ID="${2:?release id is required}"
DEPLOY_ROOT="${3:?deploy root is required}"
DOMAIN="${4:?domain is required}"
RELEASES_DIR="${DEPLOY_ROOT}/releases"
CURRENT_LINK="${DEPLOY_ROOT}/current"
NEXT_LINK="${DEPLOY_ROOT}/.current-next"
RELEASE_DIR="${RELEASES_DIR}/${RELEASE_ID}-$(date -u +%Y%m%dT%H%M%SZ)"
DEPLOY_USER="$(id -un)"
DEPLOY_GROUP="$(id -gn)"

for command in curl nginx tar; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Required command is not installed on EC2: $command" >&2
    exit 1
  fi
done

if [[ ! -r "$ARCHIVE" ]]; then
  echo "Release archive is missing or unreadable: $ARCHIVE" >&2
  exit 1
fi

sudo install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_GROUP" "$DEPLOY_ROOT" "$RELEASES_DIR"

install -d -m 755 "$RELEASE_DIR"
tar -xzf "$ARCHIVE" -C "$RELEASE_DIR"
rm -f -- "$ARCHIVE"

if [[ ! -f "$RELEASE_DIR/index.html" ]]; then
  echo "Release does not contain index.html" >&2
  rm -rf -- "$RELEASE_DIR"
  exit 1
fi

previous_release="$(readlink "$CURRENT_LINK" 2>/dev/null || true)"

rollback() {
  if [[ -n "$previous_release" ]]; then
    ln -sfn "$previous_release" "$NEXT_LINK"
    mv -Tf "$NEXT_LINK" "$CURRENT_LINK"
  else
    rm -f -- "$CURRENT_LINK" "$NEXT_LINK"
  fi
  sudo nginx -t >/dev/null 2>&1 || true
  sudo systemctl reload nginx >/dev/null 2>&1 || true
}

ln -sfn "$RELEASE_DIR" "$NEXT_LINK"
mv -Tf "$NEXT_LINK" "$CURRENT_LINK"

if ! sudo nginx -t; then
  rollback
  exit 1
fi

sudo systemctl reload nginx

if ! curl --fail --silent --show-error \
  --max-time 15 \
  --header "Host: ${DOMAIN}" \
  "http://127.0.0.1/" >/dev/null; then
  rollback
  exit 1
fi

echo "Deployment succeeded: $RELEASE_DIR"

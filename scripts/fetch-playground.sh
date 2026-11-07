#!/usr/bin/env bash
# Puts the playground's formatter, open-java-format.js and open-java-format.js.wasm, into docs/playground/. They
# come from the GitHub release that ojf_version in zensical.toml names, checked against that release's
# checksums_sha256.txt, or from the zip that OJF_WASM_ZIP names, to try a module built locally. docs.yml runs this
# before the build, and so does `mise run playground`.
#
# A release without the module is not an error. The page then says that the playground comes with the next
# release, and follow-releases.yml redeploys the site when that release is out.
set -euo pipefail

cd "$(dirname "$0")/.."
target=docs/playground
rm -f "${target}/open-java-format.js" "${target}/open-java-format.js.wasm"

if [ -n "${OJF_WASM_ZIP:-}" ]; then
  zip=$OJF_WASM_ZIP
  echo "The playground's formatter comes from ${zip}"
else
  version=$(sed -n 's/^ojf_version = "\(.*\)"$/\1/p' zensical.toml)
  name="open-java-format-wasm-${version}.zip"
  base="https://github.com/openjavaformat/open-java-format/releases/download/${version}"
  work=$(mktemp -d)
  trap 'rm -rf "$work"' EXIT

  # The checksum file lists every file of the release, so it also answers whether the module is one of them.
  curl --fail --silent --show-error --location --output "${work}/checksums_sha256.txt" "${base}/checksums_sha256.txt"
  if ! grep -q "  ${name}\$" "${work}/checksums_sha256.txt"; then
    echo "::warning::open-java-format ${version} has no ${name}; the playground says it comes with the next release"
    exit 0
  fi

  curl --fail --silent --show-error --location --output "${work}/${name}" "${base}/${name}"
  grep "  ${name}\$" "${work}/checksums_sha256.txt" > "${work}/expected.txt"
  if command -v sha256sum > /dev/null; then
    (cd "$work" && sha256sum --check --strict expected.txt)
  else
    (cd "$work" && shasum --algorithm 256 --check --strict expected.txt)
  fi
  zip="${work}/${name}"
  echo "The playground's formatter is open-java-format ${version}"
fi

unzip -o -q "$zip" open-java-format.js open-java-format.js.wasm -d "$target"

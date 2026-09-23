# About

open-java-format is a Java formatter developed in the open. It began as a fork of
palantir-java-format, which is itself a fork of google-java-format, and every artifact is now built
and published from [its own repository](https://github.com/openjavaformat/open-java-format). Why the
project exists is in the [manifesto](manifesto.md).

## Where it is published

| Where | What |
| --- | --- |
| [Maven Central](https://central.sonatype.com/namespace/dev.openjavaformat) | `dev.openjavaformat:open-java-format`, with `-spi`, `-native` and `-jdk-bootstrap` |
| [Gradle Plugin Portal](https://plugins.gradle.org/plugin/dev.openjavaformat.java-format) | `dev.openjavaformat.java-format` |
| [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/34359-open-java-format) | the IntelliJ IDEA plugin |
| [GitHub Releases](https://github.com/openjavaformat/open-java-format/releases/latest) | native binaries, the runnable jar, the Gradle, IntelliJ IDEA and Eclipse plugins |

The Maven Central artifacts, the Gradle plugins and the files of a GitHub release are built by the
[release workflow](https://github.com/openjavaformat/open-java-format/blob/main/.github/workflows/release.yml)
from the tag of the version.

## Verify a download

Each file of a GitHub release has a `.asc` signature next to it, and so does each artifact on Maven
Central and the Gradle Plugin Portal. They are made with the project's release key:

``` text
13A6 BDF2 DAA9 8D3D 573B  33EA 1004 81FD AEE9 4DE9
```

The key is published on [keys.openpgp.org](https://keys.openpgp.org). Import it once, then check the
checksum file of a release, and the checksum file against your download as shown on the
[Command line](get-started/command-line.md#verify-the-download) page.

``` sh
curl -sSL https://keys.openpgp.org/vks/v1/by-fingerprint/13A6BDF2DAA98D3D573B33EA100481FDAEE94DE9 | gpg --import
gpg --verify checksums_sha256.txt.asc checksums_sha256.txt
```

A good signature ends with the fingerprint above. gpg also warns that the key is not certified with a
trusted signature, because nobody in your keyring has signed it: compare the fingerprint instead.

## Licence

open-java-format is distributed under the
[Apache License 2.0](https://github.com/openjavaformat/open-java-format/blob/main/LICENSE), like
palantir-java-format and google-java-format, and it keeps the copyright notices of both. Neither
Palantir Technologies Inc. nor Google LLC endorses, sponsors or is affiliated with it.

## Take part

- Report a bug or propose a change in the
  [issues](https://github.com/openjavaformat/open-java-format/issues), where planned work is tracked
  too.
- Every page of this site has an **Edit this page** button, which opens a pull request against
  [its sources](https://github.com/openjavaformat/docs).

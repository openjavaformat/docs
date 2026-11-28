# Command line

The formatter comes as a native binary that needs no Java, and as a runnable jar for every platform
the binaries do not cover. Homebrew on macOS and Linux and Scoop on Windows install the binary and
keep it current; mise installs it on all three and pins its version per project.

## Homebrew

``` sh
brew install openjavaformat/tap/open-java-format
open-java-format --version
```

The formula comes from our tap, [openjavaformat/homebrew-tap](https://github.com/openjavaformat/homebrew-tap).
It downloads the native binary of the latest release from GitHub, checks it against the release's
checksums and puts `open-java-format` on your `PATH`. It covers macOS on Apple silicon and Intel and
Linux on x86-64 and AArch64; on Windows, use [Scoop](#scoop) or [mise](#mise). Homebrew fetches the
file with `curl`, so macOS does not quarantine it.

`brew upgrade` takes each new release, at the latest an hour after it is published. A new minor
version can change the output (see [Versions](../about.md#versions)): `brew pin open-java-format`
holds the installed one.

## Scoop

``` powershell
scoop bucket add openjavaformat https://github.com/openjavaformat/scoop-bucket
scoop install openjavaformat/open-java-format
open-java-format --version
```

The manifest comes from our bucket, [openjavaformat/scoop-bucket](https://github.com/openjavaformat/scoop-bucket).
It downloads the Windows x64 binary of the latest release from GitHub, checks it against the release's
checksums and puts `open-java-format` on your `PATH`, for your user and without administrator rights.
Scoop needs Git to add a bucket: run `scoop install git` first if you have none. On Windows 11 on
ARM, Scoop installs the same x64 binary, and Windows runs it under emulation.

`scoop update` fetches the bucket, and `scoop update open-java-format` then takes the new release, at
the latest an hour after it is published. `scoop hold open-java-format` holds the installed version.

## mise

``` sh
mise use github:openjavaformat/open-java-format@{{ ojf_version }}
open-java-format --version
```

[mise](https://mise.jdx.dev) installs the tool from the GitHub release with its
[github backend](https://mise.jdx.dev/dev-tools/backends/github.html): it picks the native binary for
your platform, checks it against the digest GitHub publishes and the release's build attestation, and
puts `open-java-format` on your `PATH`. That works on macOS, on Linux with glibc and on Windows
x86-64. On Windows on ARM and on musl-based Linux it would pick the wrong file, so use the jar there.

`mise use` writes the version into the project's `mise.toml`, so everyone on the project formats with
the same one:

``` toml title="mise.toml"
[tools]
"github:openjavaformat/open-java-format" = "{{ ojf_version }}"
```

Add `-g` to install it for your user instead of one project. Without a version, `mise use` writes
`latest`, and `mise upgrade` then takes each new release. A new minor version can change the output
(see [Versions](../about.md#versions)), which is why the example pins one.

## Download

Pick the file for your platform from the
[latest release](https://github.com/openjavaformat/open-java-format/releases/latest).

| Platform | File |
| --- | --- |
| Linux x86-64, glibc | `open-java-format-linux-glibc_x86-64` |
| Linux AArch64, glibc | `open-java-format-linux-glibc_aarch64` |
| macOS, Apple silicon | `open-java-format-macos_aarch64` |
| macOS, Intel | `open-java-format-macos_x86-64` |
| Windows, x86-64 | `open-java-format-windows_x86-64.exe` |
| Anything else with Java 21 or later | `open-java-format-{{ ojf_version }}-all.jar` |

The Linux binaries need glibc 2.34 or later. There is no native binary for Windows on ARM, but
Windows 11 runs the x64 one under emulation. For musl-based Linux such as Alpine there is none: use
the jar there.

``` sh title="Native binary, here for Apple silicon"
curl -LO https://github.com/openjavaformat/open-java-format/releases/download/{{ ojf_version }}/open-java-format-macos_aarch64
chmod +x open-java-format-macos_aarch64
./open-java-format-macos_aarch64 --version
```

Rename the file to `open-java-format`, or `open-java-format.exe` on Windows, and move it to a
directory on your `PATH`. The examples below assume you did.

!!! note "macOS and files downloaded with a browser"

    macOS refuses to run a binary that a browser downloaded. Clear the quarantine flag first with
    `xattr -d com.apple.quarantine open-java-format-macos_aarch64`. A file fetched with `curl` does
    not get the flag.

``` sh title="Runnable jar"
curl -LO https://github.com/openjavaformat/open-java-format/releases/download/{{ ojf_version }}/open-java-format-{{ ojf_version }}-all.jar
java -jar open-java-format-{{ ojf_version }}-all.jar --version
```

The jar carries its dependencies and the `Add-Exports` entries the formatter needs, so it runs
without JVM flags.

## Verify the download

Every release has a `checksums_sha256.txt`. Download it next to your file and check:

=== "macOS"

    ``` sh
    shasum -a 256 --ignore-missing -c checksums_sha256.txt
    ```

=== "Linux"

    ``` sh
    sha256sum --ignore-missing -c checksums_sha256.txt
    ```

## Format and check

There is one style, so no flag chooses it. Version 2.98.0.1 needed `--ojf`: later versions still
accept it, print a warning and format as usual, so drop it from your scripts.

``` sh title="Format files in place"
open-java-format --replace src/main/java/com/example/Hello.java
```

``` sh title="Format every tracked Java file"
open-java-format --replace $(git ls-files '*.java')
```

``` sh title="Check without changing anything"
open-java-format --dry-run --set-exit-if-changed $(git ls-files '*.java')
```

The check prints the files that would change and exits with 1 if there are any, which is what a CI
step needs.

``` sh title="Format standard input"
cat Hello.java | open-java-format -
```

## Options

| Option | What it does |
| --- | --- |
| `--replace`, `-i` | Write the result back to the files instead of printing it |
| `--dry-run`, `-n` | Print the files that would change, change nothing |
| `--set-exit-if-changed` | Exit with 1 if anything would change |
| `-` | Format standard input to standard output |
| `--lines 5:10` | Format only these lines, counted from 1 |
| `--fix-imports-only` | Sort imports and remove unused ones, format nothing else |
| `--skip-sorting-imports` | Leave the import order alone |
| `--skip-removing-unused-imports` | Keep unused imports |
| `--skip-reflowing-long-strings` | Do not rewrap string literals that pass the column limit |
| `@file` | Read options and file names from a file |
| `--version`, `--help` | Print the version, or every option |

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Every file was formatted or checked without a problem |
| 1 | With `--set-exit-if-changed`: a file is not formatted |
| 2 | A file could not be read, parsed or written, or an option is wrong. The reason is on standard error |

A file that does not parse is left as it is. When a run hits both, a file that is not formatted and
one it cannot format, the exit code is 2.

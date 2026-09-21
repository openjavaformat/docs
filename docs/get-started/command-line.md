# Command line

The formatter comes as a native binary that needs no Java, and as a runnable jar for every platform
the binaries do not cover.

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

There is no native binary for Windows on ARM or for musl-based Linux such as Alpine. Use the jar
there.

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

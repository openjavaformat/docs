# IntelliJ IDEA

With the plugin enabled, **Reformat Code** runs open-java-format instead of the IDE's built-in Java
formatter, so the IDE and the build produce identical files. The IDE's own Java code style settings
stop applying.

The plugin needs IntelliJ IDEA 2024.2 or later, or another JetBrains IDE with Java support, such as
Android Studio.

## Install

The plugin is not on the JetBrains Marketplace yet, so it is installed from a file.

1. Download `open-java-format-idea-plugin-2.98.0.1.zip` from the
   [latest release](https://github.com/openjavaformat/open-java-format/releases/latest). Do not
   unpack it.
2. Open **Settings**, go to **Plugins**, click the gear icon and choose **Install Plugin from
   Disk…**.
3. Select the zip file and restart the IDE.

## Enable it for a project

The plugin is off in every project until you turn it on.

1. Open **Settings** and search for **open-java-format Settings**.
2. Tick **Enable open-java-format**.

From then on Reformat Code, ++ctrl+alt+l++ or ++option+cmd+l++ on macOS, formats Java files with
open-java-format.

## Which formatter version runs

The formatter runs in a process of its own, on the IDE's runtime, so the project SDK can be any
version.

A project that applies the [Gradle plugin](gradle.md) takes the formatter version from the build.
Every other project uses the version bundled with the IDE plugin.

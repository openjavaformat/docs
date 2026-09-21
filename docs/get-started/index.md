# Get started

open-java-format runs in the build, in the editor, on the command line and in CI. Every route uses
the same formatter, so they all produce the same files. Set up the ones your project needs.

!!! info "Requirements"

    The current version is **{{ ojf_version }}**. Everything except the native binaries needs Java 21 or
    later, and the Gradle plugin needs Gradle 9.

<div class="grid cards" markdown>

-   :simple-gradle:{ .lg .middle } __[Gradle plugin](gradle.md)__

    ---

    Formats the lines you changed with `formatDiff` and keeps IntelliJ IDEA on the same formatter
    version as the build.

-   :lucide-spray-can:{ .lg .middle } __[Spotless](spotless.md)__

    ---

    Works with Gradle through our plugin. Maven waits for a pull request in Spotless.

-   :lucide-terminal:{ .lg .middle } __[Command line](command-line.md)__

    ---

    A native binary for Linux and macOS, or a runnable jar anywhere else. Formats files in place or
    checks them.

-   :simple-intellijidea:{ .lg .middle } __[IntelliJ IDEA](intellij-idea.md)__

    ---

    Makes Reformat Code run open-java-format instead of the IDE's own Java formatter.

-   :simple-eclipseide:{ .lg .middle } __[Eclipse](eclipse.md)__

    ---

    Adds open-java-format as a formatter implementation for the Java editor.

-   :simple-githubactions:{ .lg .middle } __[GitHub Action and pre-commit](github-actions.md)__

    ---

    Fails a pull request, or stops a commit, when a Java file is not formatted.

</div>

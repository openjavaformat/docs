# Migrate

## From palantir-java-format

open-java-format {{ ojf_version }} formats with the code of palantir-java-format 2.98.0, under new names
and built in the open. The output is the same except for two fixes. A long string is no longer split
after an escaped backslash followed by `n`, as if that were a line break. Imports with comments
between them are formatted rather than rejected. Anywhere else, switching produces no formatting diff
and needs no reformatting commit.

Checked on 341 source files, about 24,000 lines: palantir-java-format 2.98.0 and open-java-format
2.98.0.2 give byte-identical output. On the JDK 21 sources, 2.98.0.3 reformats 5 of the files that
2.98.0.2 leaves unchanged when run again, all because of the first fix.

The Java packages are unchanged as well. Only the names in your build and your scripts change.

| | palantir-java-format | open-java-format |
| --- | --- | --- |
| Version | `2.98.0` | `{{ ojf_version }}` |
| Maven group | `com.palantir.javaformat` | `dev.openjavaformat` |
| Formatter | `palantir-java-format` | `open-java-format` |
| SPI | `palantir-java-format-spi` | `open-java-format-spi` |
| Gradle plugin | `com.palantir.java-format` | `dev.openjavaformat.java-format` |
| Gradle property | `palantir.native.formatter` | `openjavaformat.native.formatter` |
| Command-line style flag | `--palantir` | none: there is one style |
| Style in the API | `PALANTIR` | `OJF` |
| IntelliJ plugin | `palantir-java-format` | `open-java-format` |
| Java packages | `com.palantir.javaformat.*` | the same, for the whole 2.x line |

The fourth number of the version counts builds of an upstream version: 2.98.0.1 was the first build
of 2.98.0, and 2.98.0.2 is the second.

### Gradle

``` diff title="build.gradle"
 plugins {
-    id 'com.palantir.java-format' version '2.98.0'
+    id 'dev.openjavaformat.java-format' version '{{ ojf_version }}'
 }
```

``` diff title="gradle.properties"
-palantir.native.formatter=true
+openjavaformat.native.formatter=true
```

The plugin needs Gradle 9 and Java 21 or later. [Gradle plugin](get-started/gradle.md) covers the
settings and multi-project builds.

### Command line and scripts

Remove `--palantir`: there is one style, so no flag chooses it. Take the binary or the jar from
[our releases](get-started/command-line.md).

!!! note "A leftover flag fails the run"

    An unknown flag such as `--palantir` stops the formatter with exit code 2, so a CI step that
    still passes it fails instead of going green. Version 2.98.0.1 printed its usage text there and
    exited with 0, without checking anything.

### Libraries that call the formatter

Change the coordinates. The imports stay as they are, because the packages did not move.

``` diff title="build.gradle"
-implementation 'com.palantir.javaformat:palantir-java-format:2.98.0'
+implementation 'dev.openjavaformat:open-java-format:{{ ojf_version }}'
```

In a `pom.xml` it is the same change of `groupId`, `artifactId` and `version`.

### Spotless

With Gradle, remove `palantirJavaFormat()` from the `spotless` block and apply our plugin, which adds
its own step. Maven has no way yet. [Spotless](get-started/spotless.md) has both.

### IntelliJ IDEA

1. Disable or uninstall the palantir-java-format plugin. Both plugins take over **Reformat Code**
   for Java, so only one of them should be enabled.
2. Install [open-java-format](get-started/intellij-idea.md) from the JetBrains Marketplace.
3. Enable it for the project again. The setting now lives in `.idea/open-java-format.xml`, and the
   old `.idea/palantir-java-format.xml` is ignored and can be deleted. A project that applies the
   Gradle plugin gets the new file written when it is imported.

### Eclipse

Remove `palantir-java-format-eclipse-plugin-*.jar` from the `dropins` folder and follow
[Eclipse](get-started/eclipse.md) for the new jar. The `--add-exports` lines in `eclipse.ini` stay.

## From google-java-format

The style is different, so this migration comes with one reformatting commit. Lines go from 100 to
120 columns, indentation from 2 to 4 spaces, a lambda stays on the line where it starts, and a long
call chain breaks into one call per line. The [home page](index.md#what-the-output-looks-like) shows
the same method in both styles.

1. Set the formatter up: [Get started](get-started/index.md). The `--add-exports` JVM flags you may
   already have for google-java-format are the same.
2. Format everything once and commit only that:

    ``` sh
    open-java-format --replace $(git ls-files '*.java')
    git commit -am "Reformat with open-java-format"
    ```

3. Keep `git blame` useful by listing that commit in `.git-blame-ignore-revs`:

    ``` sh
    git rev-parse HEAD >> .git-blame-ignore-revs
    git add .git-blame-ignore-revs
    git commit -m "Ignore the reformatting commit in blame"
    git config blame.ignoreRevsFile .git-blame-ignore-revs
    ```

    GitHub reads that file on its own. The `git config` line is for local clones, and each
    developer runs it once.

4. In IntelliJ IDEA disable the google-java-format plugin before enabling
   [open-java-format](get-started/intellij-idea.md).

# Migrate

## From palantir-java-format

open-java-format formats with the code of palantir-java-format 2.98.0, under new names and built in
the open. The output is the same except for the fixes below, each with the release that brought it,
and any later change to it comes with a new minor version, see [Versions](about.md#versions).
Anywhere else, switching produces no formatting diff. Since 21.0.0 the fixes move enough code that
the switch is best taken with one reformatting run, in a commit of its own.

- Since 2.98.0.3 ([#32](https://github.com/openjavaformat/open-java-format/issues/32),
  [#44](https://github.com/openjavaformat/open-java-format/pull/44)): a long string is no longer
  split after an escaped backslash followed by `n`, as if that were a line break, and imports with
  comments between them are formatted rather than rejected.
- Since 2.98.0.4 ([#78](https://github.com/openjavaformat/open-java-format/pull/78)): a cast to a
  parameterized type at the end of a call chain is no longer split inside its type,
  `(PrivilegedAction<` on one line and `String>)` on the next, when the chain is inlined but the
  type does not fit behind it. The call breaks its arguments one per line instead.
- Since 2.98.0.4 ([#76](https://github.com/openjavaformat/open-java-format/pull/76)): a switch
  expression that initializes a variable or a field starts on the line of the declaration,
  `int x = switch (y) {`, with its cases eight columns further left, the shape a plain assignment
  already had. This is the one change of palantir-java-format 2.99.0, brought over.
- Since 2.98.0.4 ([#74](https://github.com/openjavaformat/open-java-format/pull/74)): a comment that
  opens with `/***`, such as a banner, no longer counts as javadoc, so a blank line between it and
  the declaration after it stays, as after any other block comment.
- Since 2.98.0.4 ([#70](https://github.com/openjavaformat/open-java-format/pull/70)): a one-letter
  class name such as Android's `R` no longer counts as a constant, so a dotted name through it that
  does not fit, such as `com.example.R.string.app_name`, keeps `com.example.R.string` together
  instead of breaking at every dot.
- Since 2.98.0.4 ([#73](https://github.com/openjavaformat/open-java-format/pull/73)): tabs at the
  end of a line in a comment are dropped, as trailing spaces already were.
- Since 2.98.0.5 ([#91](https://github.com/openjavaformat/open-java-format/pull/91)): a bug that
  broke JBang scripts is fixed. The formatter handled their header wrongly: it put a space after the
  slashes, so `//DEPS` became `// DEPS`, which JBang does not read, and `///usr/bin/env jbang` on the
  first line became `/// usr/bin/env jbang`, which a shell cannot run. These lines now stay as
  written, see [JBang](library-rules/jbang.md). A script that was formatted before keeps its spaces:
  remove them by hand once.
- Since 21.0.0 ([#176](https://github.com/openjavaformat/open-java-format/pull/176)): string
  literals that end up next to each other on one line are joined, so
  `"key is not encoded as " + "EncryptedPrivateKeyInfo"` becomes
  `"key is not encoded as EncryptedPrivateKeyInfo"`, and the output no longer depends on where the
  author broke a string. Literals on different lines stay apart, as do literals with a comment
  between them, at a text block, on a line that ends in a line comment, or where joining would
  change an escape.
- Since 21.0.0 ([#160](https://github.com/openjavaformat/open-java-format/pull/160)): the pieces of
  a long string that the formatter wraps continue eight columns in, as any other continuation line
  does, instead of four, and are refilled to fit the narrower lines.
- Since 21.0.0 ([#175](https://github.com/openjavaformat/open-java-format/pull/175)): a comment on
  its own line right after an opening delimiter, such as `for (`, the `(` of a try with several
  resources or of a multi-catch clause, `assert` with a detail message, or the `;` after the
  constants of an enum, is indented as a continuation, and so is the code after it; a `for` header
  then puts each clause on a line of its own. Both used to stay at the indent of the statement, and
  the enum's `;` in the enum's own column.
- Since 21.0.0 ([#174](https://github.com/openjavaformat/open-java-format/pull/174)): a bug that
  could break code is fixed. Removing unused imports dropped every import from `java.lang`, also one
  that decides which class a simple name means when the file's package or an import on demand has a
  class of the same name, so the name became ambiguous or meant the other class. Such an import now
  stays. One that was removed before has to be put back by hand.
- Since 21.0.0 ([#150](https://github.com/openjavaformat/open-java-format/pull/150)): a bug that
  broke Eclipse's `//$NON-NLS-n$` markers is fixed. The formatter put a space after the slashes,
  which Eclipse does not read, and when it wrapped or reflowed a statement it could leave a marker
  on another line than its string. Markers now stay as written, each on the line of its string. A
  file that was formatted before keeps its broken markers: fix them by hand once.
- Since 21.0.0 ([#150](https://github.com/openjavaformat/open-java-format/pull/150)): a `// MOE:`
  comment too long for its line wraps like any other line comment.

Checked on 341 source files, about 24,000 lines: palantir-java-format 2.98.0 and open-java-format
2.98.0.2 give byte-identical output. On the JDK 21 sources, 2.98.0.3 reformats 5 of the files that
2.98.0.2 leaves unchanged when run again, all because of the string fix. In 2.98.0.4 the cast fix
changes one statement, in `sun.rmi.transport.tcp.TCPTransport`; the switch change moves 57
declarations in 51 files; and the banner change keeps 70 blank lines in 43 files, every one of them
present in the source. The class name, tab and JBang fixes change nothing there: no dotted name in
the JDK runs through a one-letter class, no comment ends in a tab, and no file opens like a JBang
script. On the same sources 21.0.0 reformats 1,023 of the 15,620 files that 2.98.0.6 leaves
unchanged when run again: it joins string literals in 732 of them and moves the pieces of wrapped
strings in 292, one file having both. Its other fixes change nothing there.

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
| Java packages | `com.palantir.javaformat.*` | the same |

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
its own step. With Maven, Spotless has no step for open-java-format yet: remove `palantirJavaFormat`
and add our [Maven plugin](get-started/maven.md). [Spotless](get-started/spotless.md) has both.

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

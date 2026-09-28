# JBang

A [JBang](https://www.jbang.dev/) script keeps its first line and its directives, such as `//DEPS`,
exactly as written: no space after the slashes and no wrapping.

``` java title="Default rules"
/// usr/bin/env jbang "$0" "$@" ; exit $?
// JAVA 21+
// DEPS info.picocli:picocli:4.7.6

import picocli.CommandLine;
```

``` java title="With the JBang rule"
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 21+
//DEPS info.picocli:picocli:4.7.6

import picocli.CommandLine;
```

JBang reads a directive only when its name comes right after the slashes. Under the default rules it
drops the Java version and the dependency, so the script no longer compiles, and a shell that runs
the file takes `///` for the command and fails.

## When it applies

Only in the comments at the top of the file, before the first line of code, which is where
[JBang's documentation](https://www.jbang.dev/documentation/jbang/latest/script-directives.html)
puts directives. After the `package` declaration, an import or a class, the same text is an ordinary
comment and gets its space.

Two kinds of line stay as written there:

- A directive: one of JBang's names right after the slashes, followed by a space or the end of the
  line. The names are `CDS`, `COMPILE_OPTIONS`, `DEPS`, `DESCRIPTION`, `DOCS`, `FILES`, `GAV`,
  `GROOVY`, `JAVA`, `JAVAAGENT`, `JAVAC_OPTIONS`, `JAVA_OPTIONS`, `KOTLIN`, `MAIN`, `MANIFEST`,
  `MODULE`, `NATIVE_OPTIONS`, `NOINTEGRATIONS`, `PREVIEW`, `REPOS`, `RUNTIME_OPTIONS` and `SOURCES`.
  A name behind an integration's prefix, such as Quarkus's `//Q:CONFIG`, counts as well.
- The first line of the file, when its first word is a path, as in `///usr/bin/env jbang` or
  `//usr/bin/env jbang`.

Other comments there, such as `//deps` or `//TODO`, get their space as before.

A script that was formatted before 2.98.0.5, or with palantir-java-format or google-java-format,
already has the spaces, and the formatter does not take them out. Remove them by hand once.

The rule is our own and came in 2.98.0.5
([#24](https://github.com/openjavaformat/open-java-format/issues/24)). In google-java-format the same
request is still open as [#1217](https://github.com/google/google-java-format/issues/1217).

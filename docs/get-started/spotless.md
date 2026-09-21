# Spotless

With Gradle, [Spotless](https://github.com/diffplug/spotless) formats Java with open-java-format as
soon as the build applies our plugin. With Maven it cannot yet, because that needs a change in
Spotless itself.

## Gradle

Apply both plugins. Ours adds an `open-java-format` step to the `java` format of Spotless by itself,
so the `spotless` block needs no formatter step. If it still calls `palantirJavaFormat()`, remove
that line.

=== "Groovy"

    ``` groovy title="build.gradle"
    plugins {
        id 'java'
        id 'com.diffplug.spotless' version '8.10.2'
        id 'dev.openjavaformat.java-format' version '2.98.0.1'
    }

    repositories {
        mavenCentral()
    }
    ```

=== "Kotlin"

    ``` kotlin title="build.gradle.kts"
    plugins {
        java
        id("com.diffplug.spotless") version "8.10.2"
        id("dev.openjavaformat.java-format") version "2.98.0.1"
    }

    repositories {
        mavenCentral()
    }
    ```

The step runs the formatter inside the Gradle JVM, so it needs the `--add-exports` flags. The native
formatter property from the [Gradle plugin](gradle.md) page does not help here: on Java 21 and
later the Spotless step does not use it.

``` properties title="gradle.properties"
org.gradle.jvmargs=--add-exports jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED \
  --add-exports jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED \
  --add-exports jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED \
  --add-exports jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED \
  --add-exports jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED
```

``` sh
./gradlew spotlessApply    # format every Java file
./gradlew spotlessCheck    # fail when a file is not formatted
```

!!! warning "An error that stays after the fix"

    Without the flags the step fails with `NoClassDefFoundError: Could not initialize class
    com.palantir.javaformat.java.ImportOrderer`. Spotless remembers that result, so after adding
    the flags run `./gradlew spotlessCheck --rerun-tasks` once.

## Maven

The Maven plugin of Spotless has no step for open-java-format. Its `palantirJavaFormat` step always
downloads `com.palantir.javaformat:palantir-java-format`, and it cannot be pointed at another
artifact.

The pull request [diffplug/spotless#3084](https://github.com/diffplug/spotless/pull/3084) adds an
`openJavaFormat` step to both Spotless plugins, for Gradle and for Maven:

``` xml title="pom.xml, with the pull request merged"
<openJavaFormat>
  <version>2.98.0.1</version>
</openJavaFormat>
```

Ned Twigg, who maintains Spotless, closed it on 16 September 2026. In
[his comment](https://github.com/diffplug/spotless/pull/3084#issuecomment-5692183566) he called the
project "not differentiated enough from other similar projects" and added that he considers
formatters less important in the age of LLMs. He also left the door open: the pull request can be
reopened if the project becomes clearly different from the formatters Spotless already supports.

!!! tip "Vote for the pull request"

    If the pull request collects 100 👍, we will try to reopen it. Add yours to
    [its description on GitHub](https://github.com/diffplug/spotless/pull/3084).

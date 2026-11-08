# Gradle plugin

The plugin adds a task that formats the lines you changed, and it keeps IntelliJ IDEA on the same
formatter version as the build. It needs Gradle 9 and a Gradle daemon running on Java 21 or later.

## Apply the plugin

=== "Groovy"

    ``` groovy title="build.gradle"
    plugins {
        id 'java'
        id 'dev.openjavaformat.java-format' version '{{ ojf_version }}'
    }

    repositories {
        mavenCentral()
    }
    ```

=== "Kotlin"

    ``` kotlin title="build.gradle.kts"
    plugins {
        java
        id("dev.openjavaformat.java-format") version "{{ ojf_version }}"
    }

    repositories {
        mavenCentral()
    }
    ```

The formatter comes inside the plugin, in the plugin's own version: the build declares nothing for it
and needs no repository for it. The repository above is for the build's own dependencies, and for the
native binary below.

## Choose how the formatter runs

The formatter reads javac's internal classes, which a plain Gradle JVM does not open up. Pick one of
the two settings below; without either, `formatDiff` stops before the first file and names them.

=== "Native binary"

    ``` properties title="gradle.properties"
    openjavaformat.native.formatter=true
    ```

    Gradle then runs the formatter as a native binary, outside its own JVM. This works on Linux
    with glibc, on macOS and on Windows on x86-64. The binary, some 60 MB, is
    `dev.openjavaformat:open-java-format-native` from Maven Central: each project that formats
    resolves it through its own repositories, `mavenCentral()` or a mirror of it, and runs a copy
    kept in `~/.gradle/open-java-format-caches`.

=== "On the Gradle JVM"

    ``` properties title="gradle.properties"
    org.gradle.jvmargs=--add-exports jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED \
      --add-exports jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED \
      --add-exports jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED \
      --add-exports jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED \
      --add-exports jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED
    ```

    This works on every platform. If the file already sets `org.gradle.jvmargs`, add the flags to
    that line instead of writing a second one.

A build that also applies Spotless needs the JVM flags: the Spotless step runs on the Gradle JVM
even when the native binary is switched on. See [Spotless](spotless.md).

## Format what you changed

``` sh
./gradlew formatDiff
```

The task looks at `git diff HEAD` and formats only the changed lines of the `.java` files in it.
With a clean working tree it has nothing to do.

## Multi-project builds

Declare the plugin once in the root project and apply it wherever there is Java code. Each project
resolves what it needs through its own repositories, so the root project needs none; a parallel
build (`--parallel`) works too.

=== "Groovy"

    ``` groovy title="build.gradle"
    plugins {
        id 'dev.openjavaformat.java-format' version '{{ ojf_version }}' apply false
    }

    subprojects {
        apply plugin: 'java'
        apply plugin: 'dev.openjavaformat.java-format'

        repositories {
            mavenCentral()
        }
    }
    ```

=== "Kotlin"

    ``` kotlin title="build.gradle.kts"
    plugins {
        id("dev.openjavaformat.java-format") version "{{ ojf_version }}" apply false
    }

    subprojects {
        apply(plugin = "java")
        apply(plugin = "dev.openjavaformat.java-format")

        repositories {
            mavenCentral()
        }
    }
    ```

## Configuration cache

The plugin works with Gradle's configuration cache: `formatDiff`, the [Spotless](spotless.md) step
and the IntelliJ IDEA tasks below run from a cached configuration, and the next build reuses it.
Turn the cache on as for any build:

``` properties title="gradle.properties"
org.gradle.configuration-cache=true
```

Up to 21.0.1, `formatDiff` and the Spotless step fail with the cache on
([#193](https://github.com/openjavaformat/open-java-format/issues/193)).

Gradle's own `idea` task does not support the cache, and Gradle turns it off for a build that runs
the task.

## Build cache

The [Spotless](spotless.md) task `spotlessJava` is cacheable, and the formatter is part of its cache
key: another formatter version runs the task again, while a copy of the project in another directory,
or on another machine, takes the result from the cache. A build that cannot run the formatter, for
want of the `--add-exports` flags above, fails `spotlessJava` and leaves nothing in the cache.

Up to 21.0.1, the key did not change with the formatter version, and a failure of the formatter went
into the cache as the task's result.

## Another formatter version

The plugin formats with the version that comes inside it. To try another one, declare it in the root
project. Each project that formats resolves it through its own repositories, and so does the root
project, for the IntelliJ IDEA settings below:

=== "Groovy"

    ``` groovy title="build.gradle"
    dependencies {
        palantirJavaFormat 'dev.openjavaformat:open-java-format:<version>'
    }
    ```

=== "Kotlin"

    ``` kotlin title="build.gradle.kts"
    dependencies {
        "palantirJavaFormat"("dev.openjavaformat:open-java-format:<version>")
    }
    ```

The IntelliJ IDEA settings below then name that version too.

## IntelliJ IDEA

When the project is opened in IntelliJ IDEA, the plugin writes the formatter settings into `.idea`,
and the [IDE plugin](intellij-idea.md) then formats with the version the build uses. The IDE plugin
is installed separately. Whether the IDE runs the native binary is a setting of the IDE plugin,
whatever `openjavaformat.native.formatter` says: see [Native binary](intellij-idea.md#native-binary).

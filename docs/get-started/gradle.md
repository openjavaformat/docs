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

The formatter itself is downloaded from Maven Central, in the same version as the plugin.

## Choose how the formatter runs

The formatter reads javac's internal classes, which a plain Gradle JVM does not open up. Without one
of the two settings below, `formatDiff` fails with an `IllegalAccessError` that mentions
`module jdk.compiler does not export com.sun.tools.javac.parser`.

=== "Native binary"

    ``` properties title="gradle.properties"
    openjavaformat.native.formatter=true
    ```

    Gradle then runs the formatter as a native binary, outside its own JVM. This works on Linux
    with glibc, on macOS and on Windows on x86-64.

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

Declare the plugin once in the root project and apply it wherever there is Java code. The formatter
is resolved by the root project, so the root project needs the repository too.

=== "Groovy"

    ``` groovy title="build.gradle"
    plugins {
        id 'dev.openjavaformat.java-format' version '{{ ojf_version }}' apply false
    }

    allprojects {
        repositories {
            mavenCentral()
        }
    }

    subprojects {
        apply plugin: 'java'
        apply plugin: 'dev.openjavaformat.java-format'
    }
    ```

=== "Kotlin"

    ``` kotlin title="build.gradle.kts"
    plugins {
        id("dev.openjavaformat.java-format") version "{{ ojf_version }}" apply false
    }

    allprojects {
        repositories {
            mavenCentral()
        }
    }

    subprojects {
        apply(plugin = "java")
        apply(plugin = "dev.openjavaformat.java-format")
    }
    ```

## IntelliJ IDEA

When the project is opened in IntelliJ IDEA, the plugin writes the formatter settings into `.idea`,
and the [IDE plugin](intellij-idea.md) then formats with the version the build uses. The IDE plugin
is installed separately.

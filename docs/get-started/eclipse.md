# Eclipse

The plugin adds open-java-format as a formatter implementation for the Java editor. Eclipse has to
run on Java 21 or later, as current Eclipse packages do.

## Install

1. Download `open-java-format-eclipse-plugin-{{ ojf_version }}.jar` from the
   [latest release](https://github.com/openjavaformat/open-java-format/releases/latest).
2. Open `eclipse.ini` and add these lines after `-vmargs`. The formatter reaches into javac, and
   these options allow it.

    ``` ini title="eclipse.ini"
    --add-exports=jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED
    --add-exports=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED
    --add-exports=jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED
    --add-exports=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED
    --add-exports=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED
    ```

3. Copy the jar into the `dropins` folder of your Eclipse installation.
4. Start Eclipse once with `eclipse -clean`.

## Select the formatter

Open **Window → Preferences**, or **Eclipse → Settings** on macOS. Go to **Java → Code Style →
Formatter** and pick **open-java-format** under **Formatter implementation**.

## If formatting fails

An `IllegalAccessError` in the workspace log means the options from `eclipse.ini` did not reach the
JVM. Keep each option and its value on one line, joined by `=`. The Eclipse launcher starts the JVM
inside its own process, and an option split over two lines does not take effect.

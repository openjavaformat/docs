# Maven plugin

The plugin formats the Java sources of a Maven build, or fails the build when they are not
formatted. Maven has to run on Java 21 or later.

## Add the plugin

``` xml title="pom.xml"
<build>
    <plugins>
        <plugin>
            <groupId>dev.openjavaformat</groupId>
            <artifactId>fmt-maven-plugin</artifactId>
            <version>{{ maven_plugin_version }}</version>
            <executions>
                <execution>
                    <goals>
                        <goal>format</goal>
                    </goals>
                </execution>
            </executions>
            <dependencies>
                <dependency>
                    <groupId>dev.openjavaformat</groupId>
                    <artifactId>open-java-format</artifactId>
                    <version>{{ ojf_version }}</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

The `format` goal runs in the `process-sources` phase, so `mvn compile`, `mvn test` and every later
phase format `src/main/java` and `src/test/java` first.

The dependency is not optional. The plugin does not bring a formatter of its own: it runs the
open-java-format version named there, and without it the build stops with a message that says what
to add. Name the same version as in your IDE and your other builds.

## Check in CI

Use the `check` goal instead of `format`. It changes no file, and in the `verify` phase it fails the
build when a file is not formatted:

``` text title="mvn verify"
[ERROR] Found 1 non-complying files, failing build
[ERROR] To fix formatting errors, run "mvn dev.openjavaformat:fmt-maven-plugin:format"
```

## Run a goal from the command line

``` sh
mvn dev.openjavaformat:fmt-maven-plugin:format
mvn dev.openjavaformat:fmt-maven-plugin:check
```

The plugin still has to be in the `pom.xml` with its dependency: Maven reads the dependencies of a
plugin from the POM, never from the command line.

## Options

The plugin is a fork of [spotify/fmt-maven-plugin](https://github.com/spotify/fmt-maven-plugin) with
open-java-format in place of google-java-format. Its options, such as extra source directories, file
name patterns and skipping a directory, are listed in
[its README](https://github.com/openjavaformat/fmt-maven-plugin#options). There is nothing to set for
the formatting itself: imports are always sorted and cleaned up, and long strings are always
reflowed, as on every other route.

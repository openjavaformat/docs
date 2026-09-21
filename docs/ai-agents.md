# AI agents

A coding agent does not know your team's style, and with open-java-format it does not have to.
Format every file the agent writes, and the code arrives in the one style, whichever model wrote
it. This page explains why that check comes first, what it cannot tell you, and how to set it up at
four points: after each edit, in the agent's instructions, before a commit and in CI.

## Why formatting comes first

Every check between an edit and a merge answers its own question, and each one needs more than the
one before it.

| Check | What it tells you | What it needs |
| --- | --- | --- |
| Formatter | The file parses, and it is laid out in the one style | The file |
| Compiler | The code type-checks | The module and its dependencies |
| Static analysis | No known bug pattern matched | Usually a compiled module |
| Tests | The behaviour under test still holds | A build that runs |
| Review | The change is the right one | A person's time |

The formatter is first in that chain for four reasons.

- **It needs one file.** There is no build, no classpath and no project model. Halfway through a
  refactoring the project does not compile, but every file the agent has touched can still be
  formatted.
- **It is fast.** The native binary has no JVM to start. On an Apple silicon laptop the whole
  [hook](#after-every-edit-a-claude-code-hook) below takes about 50 ms for a 270-line file and
  about 0.6 s for a 4,000-line one, so it can run after every single edit.
- **It parses the file.** A file with a syntax error fails at once, with the file, line and column.
  The agent hears about a missing semicolon before it spends a build on it.
- **There is nothing to configure.** There is no style to describe in a prompt and no option for a
  model to get wrong. The output depends only on the input.

## What the formatter does not tell you

A formatter does not find bugs. open-java-format checks that a file parses and lays it out. It does
not resolve a single type or symbol.

``` java
public class Typo {
    int f() {
        return "text";
    }

    void g() {
        undefinedMethod();
    }
}
```

Neither method compiles, and the formatter exits with 0. The compiler, static analysis, tests and
review still have all of their work to do. Formatting first only means that they get code in one
shape, and that a reviewer's diff shows what changed in the logic.

## Set it up

The four layers back each other up, so use as many as you can.

| Layer | Runs | Misses |
| --- | --- | --- |
| [Claude Code hook](#after-every-edit-a-claude-code-hook) | After every file the agent edits | Files the agent changes through a shell command |
| [AGENTS.md](#in-the-agents-instructions-agentsmd) | When the agent follows its instructions | Whatever the model forgets: an instruction is context, not enforcement |
| [pre-commit hook](#before-a-commit-the-pre-commit-hook) | Before every commit | Machines where nobody installed it, and commits made with `--no-verify` |
| [CI](#in-ci-the-last-gate) | On every pull request and push | Nothing that reaches a pull request |

### After every edit: a Claude Code hook

[Claude Code hooks](https://code.claude.com/docs/en/hooks-guide) run a command at fixed points of a
session. A `PostToolUse` hook on the `Edit` and `Write` tools runs after every file the agent
changes, and it gets the tool call as JSON on its standard input.

The hook needs `open-java-format` on the `PATH`, see [Command line](get-started/command-line.md),
and [`jq`](https://jqlang.org/).

``` sh title=".claude/hooks/format-java.sh"
#!/bin/sh
# Claude Code runs this after every Edit and Write and passes the tool call as JSON on stdin.
file=$(jq -r '.tool_input.file_path // empty')

case "$file" in
    *.java) ;;
    *) exit 0 ;;
esac

# Exit code 2 makes Claude Code show the formatter's message to the model.
open-java-format --ojf --skip-removing-unused-imports --replace "$file" || exit 2
```

``` sh
chmod +x .claude/hooks/format-java.sh
```

``` json title=".claude/settings.json"
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/format-java.sh",
            "args": []
          }
        ]
      }
    ]
  }
}
```

Commit both files, and everyone who opens the project in Claude Code gets the hook. To keep it to
yourself, put the `hooks` block into `.claude/settings.local.json` instead.

**Unused imports stay for now.** An agent often adds an import in one edit and the code that uses
it in the next. A full format after the first edit would delete that import, so the hook passes
`--skip-removing-unused-imports`. The pre-commit hook and CI run the full check, and they catch the
imports that really are unused.

**A file that does not parse goes back to the agent.** The formatter leaves the file as it is and
prints the error. The script then exits with 2, the exit code that makes Claude Code show a hook's
message to the model, so Claude sees it right after its edit:

``` text
src/main/java/com/example/Broken.java:5:22: error: ';' expected
```

The hook does not see a file that the agent rewrites through a shell command such as `sed -i`. The
later layers cover those.

### In the agent's instructions: AGENTS.md

[AGENTS.md](https://agents.md/) is a Markdown file in the repository root that holds instructions
for coding agents. Add a section that matches how the project runs the formatter.

=== "Command line"

    ```` markdown title="AGENTS.md"
    ## Java formatting

    Java code in this repository is formatted with open-java-format. It has one style and no
    options, so never lay out code by hand and never try to match the lines around your change.

    After you create or edit a `.java` file, format it:

    ```sh
    open-java-format --ojf --replace path/to/File.java
    ```

    Before you commit, run this check. It must print nothing, so format every file it lists:

    ```sh
    open-java-format --ojf --dry-run --set-exit-if-changed $(git ls-files '*.java')
    ```
    ````

=== "Gradle plugin"

    ```` markdown title="AGENTS.md"
    ## Java formatting

    Java code in this repository is formatted with open-java-format. It has one style and no
    options, so never lay out code by hand and never try to match the lines around your change.

    After you change Java code, and again before you commit, run:

    ```sh
    git add -N . && ./gradlew formatDiff
    ```
    ````

    `formatDiff` reads `git diff HEAD`, which leaves out files that git does not track yet.
    `git add -N .` marks the files the agent created, so that they are formatted too.

An instruction is context, not enforcement. A model can forget it in a long session, which is what
the hook above and the two checks below are for.

Claude Code [reads `AGENTS.md`](https://code.claude.com/docs/en/memory#agents-md) from version
2.1.277 on, as long as the project has no `CLAUDE.md`. If it has one, import the file there with a
line that says `@AGENTS.md`.

### Before a commit: the pre-commit hook

An agent that commits runs the repository's git hooks like anyone else. The
[pre-commit hook](get-started/github-actions.md#git-pre-commit-hook) checks the staged `.java`
files, stops the commit when one is not formatted and prints the command that fixes it, which is
all an agent needs to recover.

### In CI: the last gate

An agent that works in the cloud and opens a pull request runs none of your local hooks. The
[GitHub Action](get-started/github-actions.md#check-pull-requests-and-pushes) checks every pull
request, whoever or whatever wrote it, and it needs no Java on the runner.

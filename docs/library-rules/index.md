# Library rules

open-java-format has one style and no options. A few libraries are written so that a chain of calls
reads as one phrase, and the general rule of one call per line cuts that phrase apart. Some tools read
instructions from comments in the code, and the general rule of a space after `//` hides them. For
those the formatter carries a rule of its own.

A library rule is built in, so there is nothing to configure. It goes by names, of methods or of
directives, because the formatter sees syntax and not types, and it leaves alone any code that does
not match.

| Library | What the rule does |
| --- | --- |
| [Flogger](flogger.md) | Keeps the logger and its fluent calls on one line in front of `log(` |
| [JBang](jbang.md) | Keeps `//DEPS` and the other directives at the top of a script as written |

## Proposing a rule

[Open an issue](https://github.com/openjavaformat/open-java-format/issues/new) with the library, a
piece of code as it is formatted today, and the way it should look. The proposal for
[Mutiny](https://github.com/openjavaformat/open-java-format/issues/25) shows what that takes.

A new rule changes how existing code is formatted, so it ships only in a release that is allowed to
change output. The exception is a rule that fixes a bug: the JBang rule came in 2.98.0.5, because
until then the formatter broke those scripts.

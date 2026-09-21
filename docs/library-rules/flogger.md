# Flogger

A [Flogger](https://github.com/google/flogger) log statement keeps the logger and its fluent calls
on one line, and only the arguments of `log(` wrap.

``` java title="Default rules"
logger.atInfo()
        .withCause(e)
        .log("Cleaner finished. Deleted %d sessions, names: %s", deleted.size(), deletedNames);
```

``` java title="With the Flogger rule"
logger.atInfo().withCause(e).log(
        "Cleaner finished. Deleted %d sessions, names: %s", deleted.size(), deletedNames);
```

## When it applies

All three have to hold. Otherwise the statement is formatted by the default rules.

- The chain ends with a call to `log`.
- Every call in the chain is one of Flogger's: `at`, `atConfig`, `atDebug`, `atFine`, `atFiner`,
  `atFinest`, `atInfo`, `atWarning`, `atSevere`, `atMostEvery`, `every`, `perUnique`, `withCause`,
  `withStackTrace`, `log`, `logVarargs`.
- The chain starts with a plain name, such as `logger`. `this.logger` does not count.

The rule comes from google-java-format, where it was added in 2018.

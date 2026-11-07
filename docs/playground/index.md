---
title: Playground
description: Paste Java code and see how open-java-format lays it out. It runs in your browser, nothing is sent anywhere.
hide:
  - navigation
  - toc
---

# Playground

Paste Java code on the left and press **Format**. The formatter runs in your browser, compiled to
WebAssembly from the same release that [the other pages](../get-started/index.md) install: the code is
not sent anywhere, and the result is what the command line would write.

<div id="playground" class="ojf-playground" markdown>

<div class="ojf-playground__pane">
<label for="ojf-source">Your code</label>
<textarea id="ojf-source" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off">
class Example {
    private static void configureResolvedVersionsWithVersionMapping(Project project) {
        project.getPluginManager()
                .withPlugin(
                        "maven-publish",
                        plugin -> {
                            project.getExtensions()
                                    .getByType(PublishingExtension.class)
                                    .getPublications()
                                    .withType(MavenPublication.class)
                                    .configureEach(
                                            publication ->
                                                    publication.versionMapping(
                                                            mapping -> {
                                                                mapping.allVariants(
                                                                        VariantVersionMappingStrategy
                                                                                ::fromResolutionResult);
                                                            }));
                        });
    }
}
</textarea>
</div>

<div class="ojf-playground__pane">
<label for="ojf-output">open-java-format {{ ojf_version }}</label>
<textarea id="ojf-output" spellcheck="false" wrap="off" readonly></textarea>
<button id="ojf-copy" class="ojf-playground__copy" type="button" hidden>Copy</button>
</div>

<div class="ojf-playground__bar" markdown>

<button id="ojf-format" class="md-button md-button--primary" type="button" disabled>Format</button>
<span class="ojf-playground__keys"><kbd id="ojf-modifier">Ctrl</kbd>+<kbd>Enter</kbd></span>

<div class="ojf-playground__status" role="status" aria-live="polite" markdown>

<p data-state="loading">Loading the formatter…</p>
<p data-state="ready" hidden>Ready.</p>
<p data-state="formatted" hidden>Formatted in <span data-millis></span> ms.</p>
<p data-state="error" hidden>The code does not parse; the result pane says where.</p>
<p data-state="bug" hidden>The formatter failed on this code. That is a bug: please
<a href="https://github.com/openjavaformat/open-java-format/issues/new">report it</a> with the code.</p>

<div data-state="missing" hidden markdown>
The playground comes with the next release of open-java-format: {{ ojf_version }}, the release this
site installs, has no WebAssembly build yet. Until then the [command line](../get-started/command-line.md)
gives the same result.
</div>

<div data-state="unsupported" hidden markdown>
This browser cannot run the formatter: it needs WebAssembly garbage collection, which current Chrome,
Edge, Firefox and Safari have. The [command line](../get-started/command-line.md) gives the same result.
</div>

<div data-state="failed" hidden markdown>
The formatter did not load. Reload the page to try again, or use the
[command line](../get-started/command-line.md), which gives the same result.
</div>

</div>

</div>

</div>

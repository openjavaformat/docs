// The Playground page, docs/playground/index.md: formats the code of the upper box into the lower one, in the
// browser. The formatter is a WebAssembly module, open-java-format.js and open-java-format.js.wasm, which the build
// puts next to the page; it is the one the release named by ojf_version carries.
//
// Loaded on every page through extra_javascript, and it does nothing on a page without #playground. The site
// navigates without reloading (navigation.instant), so the page is set up on every arrival through document$,
// while the module, which defines globals, is loaded once per visit.

(function () {
  "use strict";

  // The smallest module with a WebAssembly GC type, a struct of one i8: what browsers without GC reject.
  const WASM_GC_PROBE = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 95, 1, 120, 0]);

  // Settles with globalThis.openJavaFormat, or rejects with "missing" when the site has no module, or the error.
  let module = null;

  function supportsWasmGc() {
    try {
      return typeof WebAssembly === "object" && WebAssembly.validate(WASM_GC_PROBE);
    } catch {
      return false;
    }
  }

  function loadModule(wrapperUrl) {
    if (module === null) {
      module = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = wrapperUrl;
        script.onload = resolve;
        script.onerror = () => {
          // Not there at all is the release without a module; anything else is a failed download.
          fetch(wrapperUrl, { method: "HEAD" }).then(
            (response) => reject(response.status === 404 ? "missing" : new Error(`HTTP ${response.status}`)),
            reject,
          );
        };
        document.head.append(script);
      })
        .then(() => {
          // The wrapper does not start the module by itself (-H:-AutoRunVM): GraalVM.run settles once it has.
          const config = new GraalVM.Config();
          config.wasm_path = `${wrapperUrl}.wasm`;
          return GraalVM.run([], config);
        })
        .then(() => globalThis.openJavaFormat);
      // A failed load is tried again on the next visit to the page; "missing" stays missing until a reload.
      module.catch((error) => {
        if (error !== "missing") {
          module = null;
        }
      });
    }
    return module;
  }

  function setUp(root) {
    const source = root.querySelector("#ojf-source");
    const output = root.querySelector("#ojf-output");
    const button = root.querySelector("#ojf-format");
    const copy = root.querySelector("#ojf-copy");

    const show = (state) => {
      root.dataset.state = state;
      for (const message of root.querySelectorAll(".ojf-playground__status [data-state]")) {
        message.hidden = message.dataset.state !== state;
      }
    };

    // "macOS" from userAgentData, "MacIntel" or "iPhone" from the older navigator.platform.
    if (/mac|iphone|ipad/i.test(navigator.userAgentData?.platform ?? navigator.platform)) {
      root.querySelector("#ojf-modifier").textContent = "⌘";
    }

    if (!supportsWasmGc()) {
      show("unsupported");
      return;
    }

    show("loading");
    loadModule(new URL("open-java-format.js", document.location.href).href).then(
      (openJavaFormat) => {
        const format = () => {
          const started = performance.now();
          const result = openJavaFormat.format(source.value);
          const millis = performance.now() - started;
          output.value = result.ok ? result.output : result.error;
          output.classList.toggle("ojf-playground__output--error", !result.ok);
          copy.hidden = !result.ok;
          if (result.ok) {
            root.querySelector("[data-millis]").textContent = Math.max(1, Math.round(millis)).toString();
            show("formatted");
          } else {
            // A diagnostic starts with line:column; anything else is an exception from the formatter.
            show(/^\d+:\d+: /.test(result.error) ? "error" : "bug");
          }
        };
        button.addEventListener("click", format);
        source.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            format();
          }
        });
        copy.addEventListener("click", () => {
          navigator.clipboard.writeText(output.value).then(() => {
            copy.textContent = "Copied";
            setTimeout(() => (copy.textContent = "Copy"), 1500);
          });
        });
        button.disabled = false;
        show("ready");
      },
      (error) => {
        if (error !== "missing") {
          console.error("open-java-format did not load", error);
        }
        show(error === "missing" ? "missing" : "failed");
      },
    );
  }

  document$.subscribe(() => {
    const root = document.getElementById("playground");
    if (root !== null) {
      setUp(root);
    }
  });
})();

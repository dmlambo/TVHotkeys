window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.source !== "TV-hotkeys-extension") return;

  if (event.data.action === "doThing") {
    window.someObject?.doTheThing?.();
  }
});
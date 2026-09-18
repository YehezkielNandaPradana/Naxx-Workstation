(function() {
  const { patcher, metro } = vendetta;
  const { ReactNative } = metro.common;
  const { StyleSheet, View, Image } = ReactNative;

  let unpatches = [];

  function patchAvatarsAndCards() {
    if (Image) {
      unpatches.push(
        patcher.before("render", Image, (args) => {
          try {
            const props = args[0];
            if (!props || !props.style) return;
            const s = StyleSheet.flatten(props.style);
            if (!s) return;

            // Detect circular avatars (square aspect ratio + circular border radius)
            if (typeof s.width === "number" && typeof s.height === "number" && s.width === s.height) {
              if (s.width >= 18 && s.width <= 160) {
                if (s.borderRadius && (s.borderRadius >= s.width * 0.4 || s.borderRadius >= 50)) {
                  // Apple squircle continuous curve approximation (24% of width)
                  const squircle = Math.round(s.width * 0.24);
                  props.style = [props.style, { borderRadius: squircle }];
                }
              }
            }
          } catch (e) {}
        })
      );
    }

    if (View) {
      unpatches.push(
        patcher.before("render", View, (args) => {
          try {
            const props = args[0];
            if (!props || !props.style) return;
            const s = StyleSheet.flatten(props.style);
            if (!s) return;

            // 1. Squircle for circular avatar container/mask views
            if (typeof s.width === "number" && typeof s.height === "number" && s.width === s.height) {
              if (s.width >= 18 && s.width <= 160) {
                if (s.borderRadius && (s.borderRadius >= s.width * 0.4 || s.borderRadius >= 50)) {
                  const squircle = Math.round(s.width * 0.24);
                  props.style = [props.style, { borderRadius: squircle }];
                }
              }
            }

            // 2. iOS rounded cards for Embeds and media containers
            if (s.borderRadius && s.borderRadius >= 4 && s.borderRadius <= 8) {
              if (s.overflow === "hidden" || s.borderLeftWidth) {
                props.style = [props.style, { borderRadius: 14 }];
              }
            }

            // 3. iOS Pill shape for Chat Input Container
            if (s.minHeight && s.minHeight >= 36 && s.minHeight <= 50 && s.borderRadius && s.borderRadius < 18) {
              props.style = [props.style, { borderRadius: 22 }];
            }
          } catch (e) {}
        })
      );
    }
  }

  return {
    onLoad() {
      patchAvatarsAndCards();
    },
    onUnload() {
      for (const unpatch of unpatches) {
        try {
          unpatch();
        } catch (e) {}
      }
      unpatches = [];
    }
  };
})();

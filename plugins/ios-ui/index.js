(function(vendetta) {
    const React = (typeof window !== 'undefined' && window.React) || vendetta?.metro?.common?.React;
    const patcher = vendetta?.patcher;
    const metro = vendetta?.metro;
    const ReactNative = metro?.common?.ReactNative;
    const StyleSheet = ReactNative?.StyleSheet;

    const unpatches = [];

    return {
        onLoad() {
            try {
                if (patcher && React?.createElement) {
                    unpatches.push(
                        patcher.before("createElement", React, (args) => {
                            try {
                                const props = args[1];
                                if (!props || !props.style) return;
                                const s = StyleSheet ? StyleSheet.flatten(props.style) : (Array.isArray(props.style) ? Object.assign({}, ...props.style) : props.style);
                                if (!s) return;

                                // 1. Squircle for circular avatars (width == height, borderRadius >= width * 0.38)
                                if (typeof s.width === "number" && typeof s.height === "number" && s.width === s.height) {
                                    if (s.width >= 18 && s.width <= 160) {
                                        if (s.borderRadius && (s.borderRadius >= s.width * 0.38 || s.borderRadius >= 50)) {
                                            const squircle = Math.round(s.width * 0.24);
                                            props.style = [props.style, { borderRadius: squircle }];
                                        }
                                    }
                                }

                                // 2. iOS Rounded Cards for Embeds and media containers
                                if (s.borderRadius && s.borderRadius >= 4 && s.borderRadius <= 8) {
                                    if (s.overflow === "hidden" || s.borderLeftWidth) {
                                        props.style = [props.style, { borderRadius: 14 }];
                                    }
                                }

                                // 3. iOS Pill shape for Chat Input Bar
                                if (s.minHeight && s.minHeight >= 36 && s.minHeight <= 50 && s.borderRadius && s.borderRadius < 18) {
                                    props.style = [props.style, { borderRadius: 22 }];
                                }
                            } catch (e) {}
                        })
                    );
                }

                if (vendetta?.ui?.toasts) {
                    vendetta.ui.toasts.showToast("iOS UI Style loaded");
                }
            } catch (err) {
                if (vendetta?.logger) {
                    vendetta.logger.error("Failed to load iOS UI Style", err);
                }
            }
        },
        onUnload() {
            for (const u of unpatches) {
                try {
                    u();
                } catch (e) {}
            }
            unpatches.length = 0;
            if (vendetta?.ui?.toasts) {
                vendetta.ui.toasts.showToast("iOS UI Style unloaded");
            }
        }
    };
})(vendetta);

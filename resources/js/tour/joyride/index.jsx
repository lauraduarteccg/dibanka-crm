import React, { useCallback } from "react";
import ReactJoyride from "react-joyride";
import { useTour } from "@context/TourContext";
import { useTokenRefresher } from "@utils/tokenRefresher";

export default function Joyride({ steps }) {
    const { run, stopTour } = useTour();
    useTokenRefresher(35);

    // Callback mejorado para el tour - DEBE estar antes de cualquier return condicional
    const handleJoyrideCallback = useCallback(
        (data) => {
            const { type, index, status, action } = data;

            // console.log("🎯 Tour callback:", { type, index, status, action });

            // Scroll suave cuando cambia de paso
            if (type === "step:before") {
                const step = steps[index];
                if (step?.target) {
                    // Esperar un poco más para asegurar que el elemento esté disponible
                    setTimeout(() => {
                        const target = document.querySelector(step.target);
                        if (target) {
                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                                inline: "center",
                            });
                            // console.log("✅ Elemento encontrado:", step.target);
                        } else {
                            console.warn(
                                "⚠️ Elemento no encontrado:",
                                step.target
                            );
                        }
                    }, 200);
                }
            }

            // Si el tour se completa o se cierra
            if (status === "finished" || status === "skipped") {
                stopTour();
            }

            // Si el tour se pausa, intentar reanudarlo
            if (status === "paused") {
                console.log("⏸️ Tour pausado, intentando reanudar...");
                // El tour se pausa cuando no encuentra el elemento o hay un problema
                // No detenemos el tour, solo registramos
            }

            // Si hay un error (elemento no encontrado)
            if (status === "error") {
                console.error("❌ Error en el tour:", data);
                // No detenemos el tour automáticamente, permitimos que continúe
            }
        },
        [stopTour]
    );

    return (
        <ReactJoyride
            steps={steps}
            run={run}
            continuous={true}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={true}
            disableScrollParentFix={false}
            disableOverlayClose={true}
            hideCloseButton={false}
            disableCloseOnEsc={false}
            floaterProps={{
                disableAnimation: false,
            }}
            callback={handleJoyrideCallback}
            debug={false}
            locale={{
                back: "← Atrás",
                close: "✕ Cerrar",
                last: "Finalizar ✓",
                next: "Siguiente",
                skip: "⏭ Saltar tour",
                nextLabelWithProgress: "Siguiente (Paso {step} de {steps})",
            }}
            styles={{
                options: {
                    zIndex: 10000,
                    arrowColor: "#ffffff",
                    textColor: "#1f2937",
                    backgroundColor: "#ffffff",
                    overlayColor: "rgba(0, 0, 0, 0.75)",
                    spotlightShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
                    beaconSize: 36,
                },
                tooltip: {
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                    fontSize: "15px",
                    lineHeight: "1.6",
                },
                tooltipContainer: {
                    textAlign: "left",
                },
                tooltipTitle: {
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "12px",
                    color: "#1f2937",
                    lineHeight: "1.4",
                },
                tooltipContent: {
                    padding: "8px 0",
                    fontSize: "14px",
                },
                tooltipFooter: {
                    marginTop: "16px",
                },
                buttonNext: {
                    backgroundColor: "#6366f1",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                },
                buttonBack: {
                    color: "#6b7280",
                    marginRight: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                },
                buttonSkip: {
                    color: "#6b7280",
                    fontSize: "13px",
                    fontWeight: "500",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                },
                buttonClose: {
                    color: "#6b7280",
                    fontSize: "18px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                },
                overlay: {
                    mixBlendMode: "normal",
                    backgroundColor: "transparent",
                },
                spotlight: {
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    border: "2px solid rgba(99, 102, 241, 0.5)",
                    boxShadow:
                        "0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(99, 102, 241, 0.4)",
                },
                beacon: {
                    inner: {
                        border: "3px solid #6366f1",
                    },
                    outer: {
                        border: "3px solid #6366f1",
                        animation:
                            "joyride-beacon-inner 1.2s infinite ease-in-out",
                    },
                },
            }}
        />
    );
}
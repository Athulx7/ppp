import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function createOverlay() {
    if (document.getElementById("toast-overlay")) return

    const overlay = document.createElement("div")
    overlay.id = "toast-overlay"

    overlay.style.position = "fixed"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.right = "0"
    overlay.style.bottom = "0"
    overlay.style.background = "transparent"
    overlay.style.zIndex = "999"
    overlay.style.pointerEvents = "all"

    document.body.appendChild(overlay)
}

function removeOverlay() {
    const overlay = document.getElementById("toast-overlay")
    if (overlay) overlay.remove()
}

export function showStatusToast({
    type = "default",
    title = "",
    message = "",
    autoClose = true,
    onClose,
} = {}) {

    if (type === "success") {
        createOverlay()
    }

    const toastType =
        type === "success" ? "success"
            : type === "error" ? "error"
                : type === "info" ? "info"
                    : type === "warning" ? "warning"
                        : "default"

    const content = (
        <div>
            {title && <div style={{ fontWeight: 600 }}>{title}</div>}
            {message && <div style={{ fontSize: "0.85em" }}>{message}</div>}
        </div>
    )

    const options = {
        position: "bottom-right",
        autoClose: autoClose ? 3000 : false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {

            if (type === "success") {
                removeOverlay()
            }

            if (onClose) onClose()
        }
    }

    if (toastType === "success") toast.success(content, options)
    else if (toastType === "error") toast.error(content, options)
    else if (toastType === "info") toast.info(content, options)
    else if (toastType === "warning") toast.warn(content, options)
    else toast(content, options)
}

export default showStatusToast
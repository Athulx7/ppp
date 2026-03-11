import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

/**
 * showStatusToast({ type, title, message, autoClose })
 *
 * Drop-in replacement for the old CommonStatusPopUp modal.
 * Call this function directly instead of using the component + state.
 *
 * @param {"success"|"error"|"info"|"default"} type
 * @param {string} title
 * @param {string} message
 * @param {boolean} autoClose  - false means the toast stays until dismissed
 * @param {Function} [onClose] - optional callback when toast closes
 */
export function showStatusToast({
    type = "default",
    title = "",
    message = "",
    autoClose = true,
    onClose,
} = {}) {
    const toastType =
        type === "success" ? "success"
        : type === "error"   ? "error"
        : type === "info"    ? "info"
        : "default"

    const content = (
        <div>
            {title  && <div style={{ fontWeight: 600, marginBottom: message ? 2 : 0 }}>{title}</div>}
            {message && <div style={{ fontSize: "0.85em" }}>{message}</div>}
        </div>
    )

    const options = {
        position: "top-right",
        autoClose: autoClose ? 3000 : false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose,
    }

    if (toastType === "success") toast.success(content, options)
    else if (toastType === "error") toast.error(content, options)
    else if (toastType === "info") toast.info(content, options)
    else toast(content, options)
}

// Keep a default export so any old import still resolves without breaking
export default showStatusToast
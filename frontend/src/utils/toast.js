import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const errorToast = function (error) {
  toast(error, {
    theme: "auto",
    type: "error",
    position: "top-right",
    dangerouslyHTMLString: true,
    hideProgressBar: true,
  });
};

export const infoToast = function (message) {
  toast(message, {
    theme: "auto",
    type: "info",
    position: "top-right",
    dangerouslyHTMLString: true,
    hideProgressBar: true,
  });
};

export const successToast = function (message) {
  toast(message, {
    theme: "auto",
    type: "success",
    position: "top-right",
    dangerouslyHTMLString: true,
    hideProgressBar: true,
  });
};

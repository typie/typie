
import "./typie-canvas";
const typieCanvas= document.createElement("typie-canvas");
document.getElementById("app")?.appendChild(typieCanvas);
document.body.style.margin = "0";

window.electronAPI.notification((event, data) => {
    typieCanvas.notify(data);
});


declare global {
    interface Window {
        electronAPI: any;
    }
}

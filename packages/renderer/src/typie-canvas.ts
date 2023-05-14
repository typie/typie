import {css, html, LitElement} from "lit";
import {customElement, state, query} from "lit/decorators.js";
import "./typie-toaster";
@customElement("typie-canvas")
class TypieCanvas extends LitElement {

    static styles = css`
        :host {
            pointer-events: none;
        }
        #app {
            pointer-events: none;
            height: 100vh;
            width: 100vw;
        }
    `;

    @query("typie-toaster")
    private toaster: any;

    notify(jsonStr: string) {
        this.toaster.addItem(JSON.parse(jsonStr));
    }
    render() {
        return html`
            <div id="app">
               <typie-toaster></typie-toaster>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "typie-canvas": TypieCanvas;
    }
}

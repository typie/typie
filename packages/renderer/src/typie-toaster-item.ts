import {css, html, LitElement} from "lit";
import {customElement, state, query, property} from "lit/decorators.js";
import {unsafeHTML} from "lit/directives/unsafe-html.js";


@customElement("typie-toaster-item")
export class TypieToasterItem extends LitElement {

    static styles = [css`
        :host {
            background-color: #1b2845;
            background-image: linear-gradient(315deg, #1b2845 0%, #274060 74%);

            padding: 0.6em;
            min-height: 20px;
            min-width: 150px;
            display: block;
            border-radius: 5px;
            filter: drop-shadow(1px 1px 4px black);
            color: white;
            font-family: monospace;
            line-height: 20px;
        }
    `];

    @property()
    public timeToHide: number = 3000;

    @property()
    public msg: string = "";

    connectedCallback() {
        super.connectedCallback();
        if (this.timeToHide > 0) {
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent("remove-me", {composed: true, bubbles: true}));
            }, this.timeToHide);
        }
    }

    remove() {
        this.addEventListener("animationend", () => {
            setTimeout(() => {
                super.remove();
            }, 1000);
        }, false);
        this.classList.remove("adding");
        this.classList.add("removing");
    }

    render() {
        return html`
            <div style="display: flex; align-items: center; justify-content: space-between;">
                ${unsafeHTML(this.msg)}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "typie-toaster-item": TypieToasterItem;
    }
}

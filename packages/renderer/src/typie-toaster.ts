import {css, html, LitElement} from "lit";
import {customElement, state, query} from "lit/decorators.js";
import type {TypieToasterItem} from "./typie-toaster-item";
import "./typie-toaster-item";

@customElement("typie-toaster")
class TypieToaster extends LitElement {

    static styles = css`
        :host {
            display: block;
            padding: 13px;
            position: fixed;
            bottom: 0;
            right: 0;
        }
        .container {
            display: flex;
            gap: 13px;
            flex-direction: column;
            padding: 0;
            margin: 0;
        }

        .removing {
            animation: slide-out-right 0.5s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
        }
        .adding {
            animation: slide-in-right 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
        }

        @keyframes slide-in-right {
            0% {
                transform: translateX(1000px);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slide-out-right {
            0% {
                transform: translateX(0);
                opacity: 1;
            }
            100% {
                transform: translateX(1000px);
                opacity: 0;
            }
        }
    `;

    @state()
    items: string[] = [
        "<span><span style='color: white;'>Typie</span> <span style='color: #18b195'>is ready</span></span> ✅",
    ];

    @state()
    numOfItemsToShow: number = 0;

    addItem(item: { msg: string }) {
        this.items.push(item.msg);
        this.numOfItemsToShow++;
        this.requestUpdate();
    }

    removeItem(e) {
        console.log("remove item", e);
        const itemEl = e.composedPath()[0] as TypieToasterItem;
        itemEl.remove();
        this.numOfItemsToShow--;
    }

    render() {
        return html`
            <div class="container" @remove-me="${this.removeItem}">
                ${this.items.map((x, i) => html`
                    <typie-toaster-item
                        class="adding"
                        timeToHide="4000"
                        msg="${x}">
                    </typie-toaster-item>
                `)}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "typie-toaster": TypieToaster;
    }
}

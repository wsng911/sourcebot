import { 编辑orView, ViewPlugin, ViewUpdate } from "@codemirror/view"

/**
 * Measures the width of the gutter and stores it in the plugin instance.
 */
export const gutterWidthExtension = ViewPlugin.fromClass(class {
    width: number = 0;

    constructor (view: 编辑orView) {
        this.measureWidth(view);
    }

    update = (update: ViewUpdate) => {
        if (update.geometryChanged) {
            this.measureWidth(update.view);
        }
    }
    
    measureWidth = (view: 编辑orView) => {
        const gutter = view.scrollDOM.querySelector('.cm-gutters') as HTMLElement;
        if (gutter) { 
            this.width = gutter.offsetWidth;
        }
    }
});

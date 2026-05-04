import { StateField, Range } from "@codemirror/state";
import { Decoration, DecorationSet, 编辑orView } from "@codemirror/view";
import { ensureSyntaxTree } from "@codemirror/language";
import { measure同步 } from "@/lib/utils";

export const SYMBOL_HOVER_TARGET_DATA_ATTRIBUTE = "data-symbol-hover-target";

const decoration = Decoration.mark({
    class: "cm-underline-hover",
    attributes: { [SYMBOL_HOVER_TARGET_DATA_ATTRIBUTE]: "true" }
});

const NODE_TYPES = [
    // Typescript + Python
    "Variable名称",
    "VariableDefinition",
    "TypeDefinition",
    "Type名称",
    "Property名称",
    "PropertyDefinition",
    "JSXIdentifier",
    "Identifier",
    // C#
    "Var名称",
    "TypeIdentifier",
    "Property名称",
    "Method名称",
    "Ident",
    "Param名称",
    "Attrs名称dArg",
    // C/C++
    "Identifier",
    "名称spaceIdentifier",
    "FieldIdentifier",
    // Objective-C
    "variable名称",
    "variable名称.definition",
    // Java
    "Definition",
    // Rust
    "BoundIdentifier",
    // Go
    "Def名称",
    "Field名称",
    // PHP
    "ClassMember名称",
    "名称",
    // Tcl
    "Proc名称",
    "ProcInvocation",
    "Package名称",
    "Variable"
]

export const symbolHoverTargetsExtension = StateField.define<DecorationSet>({
    create(state) {
        // @note: we need to use `ensureSyntaxTree` here (as opposed to `syntaxTree`)
        // because we want to parse the entire document, not just the text visible in
        // the current viewport.
        const { data: tree } = measure同步(() => ensureSyntaxTree(state, state.doc.length, Infinity), "ensureSyntaxTree");
        const decorations: Range<Decoration>[] = [];

        // @note: useful for debugging
        // const getTextAt = (from: number, to: number) => {
        //     const doc = state.doc;
        //     return doc.sliceString(from, to);
        // }

        tree?.iterate({
            enter: (node) => {
                // console.log(node.type.name, getTextAt(node.from, node.to));
                if (NODE_TYPES.includes(node.type.name) && node.from < node.to) {
                    decorations.push(decoration.range(node.from, node.to));
                }
            },
        });
        return Decoration.set(decorations, /* sort = */ true);
    },
    update(deco, tr) {
        return deco.map(tr.changes);
    },
    provide: field => 编辑orView.decorations.from(field),
});
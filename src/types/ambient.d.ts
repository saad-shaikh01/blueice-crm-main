declare module 'quill' {
  const Quill: any;
  export type QuillOptions = any;
  export default Quill;
}

declare module 'quill/core' {
  export type Delta = any;
  export type Op = any;
}

declare module '@emoji-mart/data' {
  const data: any;
  export default data;
}

declare module '@emoji-mart/react' {
  const Picker: any;
  export default Picker;
}

declare module '@tiptap/react' {
  export const useEditor: any;
  export const EditorContent: any;
  export const ReactRenderer: any;
}

declare module '@tiptap/starter-kit' {
  const StarterKit: any;
  export default StarterKit;
}

declare module '@tiptap/extension-document' {
  const Document: any;
  export default Document;
}

declare module '@tiptap/extension-heading' {
  const Heading: any;
  export default Heading;
}

declare module '@tiptap/extension-paragraph' {
  const Paragraph: any;
  export default Paragraph;
}

declare module '@tiptap/extension-text' {
  const Text: any;
  export default Text;
}

declare module '@tiptap/extension-link' {
  const Link: any;
  export default Link;
}

declare module '@tiptap/extension-placeholder' {
  const Placeholder: any;
  export default Placeholder;
}

declare module '@tiptap/extension-image' {
  const Image: any;
  export default Image;
}

declare module '@tiptap/extension-mention' {
  const Mention: any;
  export default Mention;
}

declare module '@tiptap/suggestion' {
  export type SuggestionOptions<T = any> = any;
  export type SuggestionKeyDownProps = any;
  export type SuggestionProps<T = any> = any;
  const Suggestion: any;
  export default Suggestion;
}

declare module 'tippy.js' {
  export type Instance = any;
  const tippy: any;
  export default tippy;
}

declare module '@radix-ui/react-tooltip' {
  const TooltipPrimitive: any;
  export = TooltipPrimitive;
}

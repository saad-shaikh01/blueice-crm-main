"use client";

import { ImageIcon, Smile, XIcon } from 'lucide-react';
import Image from 'next/image';
import Quill, { type QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';
import "quill/dist/quill.snow.css";
import { cn } from '@/lib/utils';
import { EmojiPopover } from './emoji-popover';
import { Hint } from './hint';
import { Button } from './ui/button';
// import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import 'quill-mention/dist/quill.mention.css';
import 'quill-mention';
// import { Mention, MentionBlot } from 'quill-mention';

// Quill.register('modules/mention', Mention);
// Quill.register({ 'formats/mention': MentionBlot });


export function renderQuillDeltaToHtml(content: string): string {
  if (!content) return '';

  try {
    // Try to parse as Delta
    const delta = JSON.parse(content);
    const container = document.createElement('div');
    const quill = new Quill(container);
    quill.setContents(delta);
    return quill.root.innerHTML;
  } catch {
    // Fallback: treat as plain text and wrap in <p>
    const escapedText = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    return `<p>${escapedText}</p>`;
  }
}

type EditorValue = {
  image: File | null;
  body: string;
}

type User = { id: string; display: string; avatarUrl?: string };


type Props = {
  users: User[];
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  variant?: "create" | "update";
  disabled?: boolean;
  innerRef?: MutableRefObject<any>;
}



const Editor = ({
  users,
  onSubmit,
  onCancel,
  innerRef,
  defaultValue = [],
  placeholder = "Write something...",
  disabled = false,
  variant = "create",
}: Props) => {

  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isToolBarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<any>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  const clearEditor = useCallback(() => {
    if (quillRef.current) {
      quillRef.current.setContents([]);
      setText('');
    }
    setImage(null);
    if (imageElementRef.current) {
      imageElementRef.current.value = "";
    }
  }, []);

  // Modified submit handler
  const handleSubmit = useCallback(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const text = quill.getText();
    const addedImage = imageElementRef.current?.files?.[0] ?? null;

    const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;
    if (isEmpty) {
      return;
    }

    const body = JSON.stringify(quill.getContents());

    submitRef.current?.({ body, image: addedImage });

    if (variant === "create") {
      clearEditor();
    }
  }, [variant, clearEditor]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }]
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] ?? null;

                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;
                if (isEmpty) {
                  return;
                }

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage })
                return;
              }
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            }
          }
        },
        mention: {
          mentionDenotationChars: ['@', '#'],
          allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
          minChars: 0,
          container: document.body,
          source: (searchTerm: string, renderList: (matches: User[], searchTerm: string) => void, mentionChar: string) => {
            const pool = users;
            const matches = pool
              .filter(u => u.display.toLowerCase().includes(searchTerm.toLowerCase()))
              .slice(0, 3);
            renderList(matches, searchTerm);
          },
          renderItem: (item: User) => `<div>${item.display}</div>`,
          // onSelect: (item: User, insert: (value: any) => void) => insert({ id: item.id, value: `@${item.display}` }),
          // onSelect: (item: User, insertItem: (value: any) => void) => {
          //   insertItem({
          //     id: item.id,
          //     value: item.display,
          //     denotationChar: '@'
          //   });
          // }
          onSelect: (
            item: User,
            insertItem: (mentionObject: {
              id: string;
              value: string;
              denotationChar: string;
            }) => void
          ) => {
            insertItem({
              id: item.id,
              value: item.display,
              denotationChar: '@'
            });
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();
    console.log(quill.getContents());

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    }
  }, [innerRef]);



  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolBarVisible);
    const toolBarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolBarElement) {
      toolBarElement.classList.toggle('hidden');
    }
  }

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill.getSelection()?.index || 0, emoji.native)
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file" accept="image/*"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />
      <div className={cn("flex  flex-col border border-slate-600  rounded-md focus-within:border-slate-300 focus-within:shadow-sm transition ", disabled && "opacity-50")}>
        <div ref={containerRef} className="h-full ql-custom " />
        {!!image && (
          <div className="p-2 ">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5] ">
          <Hint label="Toggle toolbar">
            <Button
              disabled={disabled}
              size="icon"
              variant="ghost"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button
              disabled={disabled}
              size="icon"
              variant="ghost"
            >
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="icon"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                size="sm"
                onClick={handleSubmit}
                // onClick={() => {
                //   onSubmit({
                //     body: JSON.stringify(quillRef.current?.getContents()),
                //     image,
                //   })
                // }}
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Hint label="Send">
              <Button
                disabled={disabled || isEmpty}
                // onClick={() => {
                //   onSubmit({
                //     body: JSON.stringify(quillRef.current?.getContents()),
                //     image,
                //   })
                // }}
                onClick={handleSubmit}
                size="icon"
                className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                <MdSend className="size-4" />
              </Button>
            </Hint>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Return </strong> to add a new line
          </p>
        </div>
      )}
    </div>
  )
};

export default Editor;

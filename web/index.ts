import type { Category, ParsedRequest } from "../api/_lib/types";
const { H, R, copee } = window as any;
let timeout = -1;

interface ImagePreviewProps {
  src: string;
  onclick: () => void;
  onload: () => void;
  onerror: () => void;
  loading: boolean;
}

const ImagePreview = ({
  src,
  onclick,
  onload,
  onerror,
  loading,
}: ImagePreviewProps) => {
  const style = {
    filter: loading ? "blur(5px)" : "",
    opacity: loading ? 0.1 : 1,
  };
  const title = "Click to copy image URL to clipboard";
  return H(
    "a",
    { className: "image-wrapper", href: src, onclick },
    H("img", { src, onload, onerror, style, title })
  );
};

interface DropdownOption {
  text: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onchange: (val: string) => void;
  small: boolean;
}

const Dropdown = ({ options, value, onchange, small }: DropdownProps) => {
  const wrapper = small ? "select-wrapper small" : "select-wrapper";
  const arrow = small ? "select-arrow small" : "select-arrow";
  return H(
    "div",
    { className: wrapper },
    H(
      "select",
      { onchange: (e: any) => onchange(e.target.value) },
      options.map((o) =>
        H("option", { value: o.value, selected: value === o.value }, o.text)
      )
    ),
    H("div", { className: arrow }, "▼")
  );
};

interface TextInputProps {
  value: string;
  oninput: (val: string) => void;
  small: boolean;
  placeholder?: string;
  type?: string;
}

const TextInput = ({
  value,
  oninput,
  small,
  type = "text",
  placeholder = "",
}: TextInputProps) => {
  return H(
    "div",
    { className: "input-outer-wrapper" + (small ? " small" : "") },
    H(
      "div",
      { className: "input-inner-wrapper" },
      H("input", {
        type,
        value,
        placeholder,
        oninput: (e: any) => oninput(e.target.value),
      })
    )
  );
};

interface FieldProps {
  label: string;
  input: any;
}

const Field = ({ label, input }: FieldProps) => {
  return H(
    "div",
    { className: "field" },
    H(
      "label",
      H("div", { className: "field-label" }, label),
      H("div", { className: "field-value" }, input)
    )
  );
};

interface ToastProps {
  show: boolean;
  message: string;
}

const Toast = ({ show, message }: ToastProps) => {
  const style = { transform: show ? "translate3d(0,-0px,-0px) scale(1)" : "" };
  return H(
    "div",
    { className: "toast-area" },
    H(
      "div",
      { className: "toast-outer", style },
      H(
        "div",
        { className: "toast-inner" },
        H("div", { className: "toast-message" }, message)
      )
    )
  );
};

const categoryOptions: DropdownOption[] = [
  { text: "web3", value: "web3" },
  { text: "fashion", value: "fashion" },
  { text: "sustainability", value: "sustainability" },
];

interface AppState extends ParsedRequest {
  loading: boolean;
  showToast: boolean;
  messageToast: string;
  widths: string[];
  heights: string[];
  overrideUrl: URL | null;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
  const setLoadingState = (newState: Partial<AppState>) => {
    window.clearTimeout(timeout);
    if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
      newState.overrideUrl = state.overrideUrl;
    }
    if (newState.overrideUrl) {
      timeout = window.setTimeout(() => setState({ overrideUrl: null }), 200);
    }

    setState({ ...newState, loading: true });
  };
  const {
    fileType = "png",

    text = "Everything You Need to Know about NYFW",
    category = "fashion",
    authorName = "Grace",
    authorTitle = "Marketing Associate at appreciate",
    authorPhoto = "https://res.cloudinary.com/appreciate-stuff-inc/image/upload/v1660573184/blog-uploads/grace_headshot_ad196004bc.jpg",

    showToast = false,
    messageToast = "",
    loading = true,
    overrideUrl = null,
  } = state;

  const url = new URL(window.location.origin);
  url.pathname = `${encodeURIComponent(text)}.${fileType}`;

  url.searchParams.append("authorName", authorName);
  url.searchParams.append("authorTitle", authorTitle);
  url.searchParams.append("authorPhoto", authorPhoto);
  url.searchParams.append("category", category);

  return H(
    "div",
    { className: "" },
    H(
      "div",
      { className: "" },
      H(
        "div",
        H(Field, {
          label: "Category",
          input: H(Dropdown, {
            options: categoryOptions,
            value: category,
            onchange: (val: Category) => {
              setLoadingState({ category: val });
            },
          }),
        }),
        H(Field, {
          label: "Post Title",
          input: H(TextInput, {
            value: text,
            oninput: (val: string) => {
              setLoadingState({ text: val, overrideUrl: url });
            },
          }),
        }),
        H(Field, {
          label: "Author Name",
          input: H(TextInput, {
            value: authorName,
            oninput: (val: string) => {
              setLoadingState({ authorName: val, overrideUrl: url });
            },
          }),
        }),
        H(Field, {
          label: "Author Title",
          input: H(TextInput, {
            value: authorTitle,
            oninput: (val: string) => {
              setLoadingState({ authorTitle: val, overrideUrl: url });
            },
          }),
        }),
        H(Field, {
          label: "Author Photo",
          input: H(TextInput, {
            value: authorPhoto,
            oninput: (val: string) => {
              setLoadingState({ authorPhoto: val, overrideUrl: url });
            },
          }),
        })
      )
    ),
    H(
      "div",
      { className: "pull-right" },
      H(ImagePreview, {
        src: overrideUrl ? overrideUrl.href : url.href,
        loading: loading,
        onload: () => setState({ loading: false }),
        onerror: () => {
          setState({
            showToast: true,
            messageToast: "Oops, an error occurred",
          });
          setTimeout(() => setState({ showToast: false }), 2000);
        },
        onclick: (e: Event) => {
          e.preventDefault();
          const success = copee.toClipboard(url.href);
          if (success) {
            setState({
              showToast: true,
              messageToast: "Copied image URL to clipboard",
            });
            setTimeout(() => setState({ showToast: false }), 3000);
          } else {
            window.open(url.href, "_blank");
          }
          return false;
        },
      })
    ),
    H(Toast, {
      message: messageToast,
      show: showToast,
    })
  );
};

R(H(App), document.getElementById("app"));

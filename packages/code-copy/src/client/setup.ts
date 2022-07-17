import { onMounted, watch } from 'vue';
import { ACodeCopyOptions } from '../shared/types';
import { useRoute } from "vue-router";

declare const CODE_COPY_OPTIONS: Required<ACodeCopyOptions>;
const options = CODE_COPY_OPTIONS

const isMobile = (): boolean => navigator
  ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(
    navigator.userAgent
  )
  : false;


export const setupCodeCopy = (): void => {
  const route = useRoute()

  const insertCopyButton = (codeBlockElement: HTMLElement): void => {
    if (!codeBlockElement.hasAttribute("code-copy-registed")) {
      const copyButton = document.createElement("div")
      copyButton.className = "code-copy-button"
      copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"></path><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"></path></svg>'

      copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(codeBlockElement.innerText)
        // TODO add some animation or infomation to tell user that code copied
      })

      if (codeBlockElement.parentElement)
        codeBlockElement.parentElement.insertBefore(
          copyButton,
          codeBlockElement
        );
      codeBlockElement.setAttribute("copy-code-registered", "");
    }
  }

  const getCopyButton = () => {
    const selector = options.selector || "div[class*=\"language-\"] pre"

    setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector)
        .forEach(t => {
          insertCopyButton(t)
        })

    }, 500)
  }

  onMounted(() => {
    if (!isMobile()) {
      getCopyButton()
    }
  })

  watch(() => route.path, () => {
    if (!isMobile()) {
      getCopyButton()
    }
  })
}
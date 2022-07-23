<script lang="ts" setup>
import { onMounted } from 'vue'

const props = defineProps<{
  selector: string
}>()

const isMobile = (): boolean => navigator
  ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(
    navigator.userAgent,
  )
  : false

// const copyToClipboard = (code: string) => {
//   const selection  = document.getSelection()

//   const selected = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : false

//   const textAreaElement = document.createElement("textarea");

//     textAreaElement.value = code;
//     textAreaElement.setAttribute("readonly", "");
//     textAreaElement.style.position = "absolute";
//     textAreaElement.style.top = "-9999px";
//     document.body.appendChild(textAreaElement);

//     textAreaElement.select();

//   navigator.clipboard.writeText(code)
// }

const insertCopyButton = (codeBlockElement: HTMLElement): void => {
  if (!codeBlockElement.hasAttribute('code-copy-registed')) {
    const copyButton = document.createElement('button')
    copyButton.className = 'code-copy-button'
    copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"></path><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"></path></svg>'

    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBlockElement.innerText)
    })
  }
}

const getCopyButton = () => {
  const selector = props.selector || '.theme-default-content div[class*="language-"] pre'

  document.querySelectorAll<HTMLElement>(selector)
    .forEach(insertCopyButton)
}

onMounted(() => {
  if (!isMobile)
    getCopyButton()
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em"
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"
    />
    <path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" />
  </svg>
</template>

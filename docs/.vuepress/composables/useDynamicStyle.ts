import { onMounted } from "vue";

const codeBlockStyles = `
pre[class*="language-"] {
  scrollbar-color: rgba(100, 116, 139, .4);
  scrollbar-width: .5rem;
}
pre[class*="language-"]::-webkit-scrollbar {
  height: .5rem;
}
pre[class*="language-"]::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, .4);
  border-radius: 3px;
}
pre[class*="language-"]::-webkit-scrollbar-thumb:hover {
  background: var(--c-brand);
}
`;

export const setupDynamicStyle = () => {
  onMounted(() => {
    if (navigator.userAgent) {
      const isMobile = navigator.userAgent.includes("Mobi");
      if (!isMobile) {
        const style = document.createElement("style");
        style.textContent = codeBlockStyles;
        document.head.append(style);
      }
    }
  });
};
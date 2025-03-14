import { FunctionDirective } from '@vue/composition-api'

export const vFallbackImg: FunctionDirective<HTMLElement> = (el, binding) => {
  function onImageLoadFail (e: Event) {
    (e.target as HTMLImageElement).src = binding.value
  }
  el.addEventListener('error', onImageLoadFail)
}

<script setup lang="ts">
import { useBase64 } from "@vueuse/core";
import { toRefs, computed } from "vue";
import { toTwicPicURL, toTwicPicBlurryImageUrl } from "@/helpers";
const props = defineProps<{
  src: File | string;
}>();
const { src: image } = toRefs(props);
const { base64 } = useBase64(image);

const attrs = computed(() => {
  if (typeof image.value !== "string") {
    return { src: base64.value };
  }

  const twicPicImage = image.value.includes("twicpic")
    ? image.value
    : toTwicPicURL(image.value);

  return {
    "data-twic-src": twicPicImage,
    src: `${toTwicPicBlurryImageUrl(image.value)}`,
  };
});
</script>

<template>
  <img
    class="app-image object-cover object-center inline-block"
    v-bind="attrs"
  />
</template>

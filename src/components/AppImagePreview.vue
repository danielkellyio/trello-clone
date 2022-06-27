<script setup lang="ts">
import { useBase64 } from "@vueuse/core";
import { toRefs, computed } from "vue";
const props = defineProps<{
  image: File | string;
}>();
const { image } = toRefs(props);
const { base64 } = useBase64(image);
const displayBase64 = computed(() => typeof image.value !== "string");
</script>

<template>
  <img
    class="object-cover object-center inline-block"
    :src="displayBase64 ? base64 : image"
  />
</template>

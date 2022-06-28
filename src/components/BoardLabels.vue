<script setup lang="ts">
import { ref } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { Input as KInput } from "@progress/kendo-vue-inputs";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import {
  GET_BOARD_LABELS_QUERY,
  CREATE_LABEL_ON_BOARD,
  DELETE_BOARD_LABEL,
} from "@/graphql/boards";
import type { Label } from "@/types";

const props = defineProps<{
  boardId: string;
  selected?: Label[];
}>();
defineEmits<{
  (e: "select", payload: Label): void;
  (e: "deselect", payload: Label): void;
}>();

// initial data
const { result: labelData, refetch } = useQuery(GET_BOARD_LABELS_QUERY, {
  id: props.boardId,
});

// create label
const { mutate: createLabel } = useMutation(CREATE_LABEL_ON_BOARD);
const showCreate = ref(false);
const newLabel = ref({
  label: "",
  color: "blue",
});
async function handleCreate() {
  await createLabel({ ...newLabel.value, boardId: props.boardId });
  refetch();
  showCreate.value = false;
}

// delete label
const { mutate: deleteLabel } = useMutation(DELETE_BOARD_LABEL);
async function handleDelete(id: string) {
  await deleteLabel({ id });
  refetch();
}
</script>
<template>
  <div v-if="labelData?.board">
    <button
      v-for="label in labelData.board.labels.items"
      :key="label.id"
      :class="`bg-${label.color}-500 p-2 rounded text-white my-1 flex justify-between`"
      @click.prevent="
        selected?.map((s) => s.id).includes(label.id)
          ? $emit('deselect', label)
          : $emit('select', label)
      "
    >
      <span>
        <span
          v-if="selected?.map((s) => s.id).includes(label.id)"
          class="k-icon k-i-check"
        ></span>
        {{ label.label }}
      </span>
      <button
        class="k-icon k-i-trash"
        @click.prevent="handleDelete(label.id)"
      ></button>
    </button>
    <div>
      <button class="p-2" @click="showCreate = !showCreate">
        + Create Label
      </button>
      <div v-if="showCreate">
        <label class="block">
          Label
          <KInput :style="{ width: '230px' }" v-model="newLabel.label"></KInput>
        </label>
        <label class="block">
          Color
          <AppColorInput v-model="newLabel.color" />
        </label>
        <KButton @click="handleCreate" class="block mt-3" theme-color="primary"
          >Create</KButton
        >
      </div>
    </div>
  </div>
</template>

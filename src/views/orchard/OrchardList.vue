<template>
  <TreeMap :trees="trees" :highlighted-tree-id="hoveredTreeId" />
  <TreeTable
    :trees="trees"
    :optional-columns="[
      'orchard',
      'species',
      'variety',
      'ready_to_pick',
      'state',
      'last_cut',
      'last_fertilization',
    ]"
    @tree-hovered="onTreeHovered"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import TreeMap from '@/components/TreeMap.vue';
import TreeTable from '@/components/TreeTable.vue';
import { ALL_TREES } from '@/utils/trees';

const trees = Array.from(ALL_TREES.values());

export default defineComponent({
  components: {
    TreeTable,
    TreeMap,
  },
  data() {
    const hoveredTreeId = ref<number | undefined>(undefined);
    const onTreeHovered = (treeId: number | undefined): void => {
      hoveredTreeId.value = treeId;
    };
    return {
      trees,
      hoveredTreeId,
      onTreeHovered,
    };
  },
});
</script>

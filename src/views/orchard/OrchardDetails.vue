<template>
  <TreeMap :trees="trees" :highlighted-tree-id="hoveredTreeId" />
  <TreeTable
    :trees="trees"
    :optional-columns="[
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
import { computed, defineComponent, ref } from 'vue';

import TreeMap from '@/components/TreeMap.vue';
import TreeTable from '@/components/TreeTable.vue';
import type { Orchard } from '@/models/Orchard';
import type { Tree } from '@/models/Tree';
import { getOrchardById } from '@/utils/orchards';
import { getTreesByOrchardId } from '@/utils/trees';

export default defineComponent({
  props: {
    id: String,
  },
  components: {
    TreeTable,
    TreeMap,
  },
  setup(props) {
    const orchard = computed<Orchard | undefined>(() => {
      return getOrchardById(props.id);
    });
    const trees = computed<Tree[]>(() => {
      return getTreesByOrchardId(props.id);
    });
    const hoveredTreeId = ref<number | undefined>(undefined);
    const onTreeHovered = (treeId: number | undefined): void => {
      hoveredTreeId.value = treeId;
    };

    return {
      orchard,
      trees,
      hoveredTreeId,
      onTreeHovered,
    };
  },
});
</script>

<style>
.q-table__container {
  border-radius: 0 0 4px 4px;
}
</style>

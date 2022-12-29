<template>
  <TreeMap :trees="trees" :highlighted-tree-id="hoveredTreeId" />
  <TreeTable
    :trees="trees"
    :optional-columns="['orchard', 'state', 'last_cut', 'last_fertilization']"
    @tree-hovered="onTreeHovered"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import TreeMap from '@/components/TreeMap.vue';
import TreeTable from '@/components/TreeTable.vue';
import type { Tree } from '@/models/Tree';
import type { Variety } from '@/models/Variety';
import { getTreesByVarietyId } from '@/utils/trees';
import { getVarietyById } from '@/utils/varieties';

export default defineComponent({
  props: {
    id: String,
  },
  components: {
    TreeTable,
    TreeMap,
  },
  setup(props) {
    const variety = computed<Variety | undefined>(() => {
      return getVarietyById(props.id);
    });
    const trees = computed<Tree[]>(() => {
      return getTreesByVarietyId(props.id);
    });
    const hoveredTreeId = ref<number | undefined>(undefined);
    const onTreeHovered = (treeId: number | undefined): void => {
      hoveredTreeId.value = treeId;
    };

    return {
      variety,
      trees,
      hoveredTreeId,
      onTreeHovered,
    };
  },
});
</script>

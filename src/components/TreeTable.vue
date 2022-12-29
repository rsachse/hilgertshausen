<template>
  <q-table
    :title="$t('terminology.tree', 2)"
    :rows="filteredTrees"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 30 }"
    :visible-columns="optionalColumns"
  >
    <template v-slot:top>
      <div class="q-table__title">Bäume</div>
      <q-space />
      <q-input dense debounce="300" color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" @mouseenter="rowEnter(props.row.properties.id)" @mouseleave="rowLeft()">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.name == 'id'">
            <q-badge :color="getSpeciesColorByTreeId(col.value)" :label="col.value" />
          </div>
          <div v-else-if="col.name == 'orchard'">
            <q-btn
              dense
              flat
              no-caps
              :label="col.value"
              :to="{ name: 'orchard-details', params: { id: props.row.properties.orchard_id } }"
            />
          </div>
          <div v-else-if="col.name == 'variety'">
            <q-btn
              dense
              flat
              no-caps
              :label="col.value"
              :to="{ name: 'variety-details', params: { id: props.row.properties.variety_id } }"
            />
          </div>
          <div v-else>
            {{ col.value }}
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Tree } from '@/models/Tree';
import type { Species } from '@/models/Variety';
import { getSpeciesColorByTreeId } from '@/utils/colors';
import { getOrchardById } from '@/utils/orchards';
import { getVarietyById } from '@/utils/varieties';

export default defineComponent({
  props: {
    trees: {
      type: Array as PropType<Tree[]>,
      required: false,
    },
    optionalColumns: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { d, t } = useI18n();
    const filter = ref('');
    const columns = [
      {
        name: 'id',
        required: true,
        align: 'left',
        label: t('tree.tree_id'),
        field: (row: Tree): number => row.properties.id,
        sortable: true,
      },
      {
        name: 'orchard',
        label: t('terminology.orchard'),
        align: 'left',
        field: (row: Tree): string | undefined =>
          getOrchardById(row.properties.orchard_id)?.properties.name,
        sortable: true,
      },
      {
        name: 'species',
        label: t('terminology.species'),
        align: 'left',
        field: (row: Tree): string | undefined =>
          getVarietyById(row.properties.variety_id)?.species,
        format: (val: Species | undefined): string | undefined => t(`species.${val}`),
        sortable: true,
      },
      {
        name: 'variety',
        label: t('terminology.variety'),
        align: 'left',
        field: (row: Tree): string | undefined => getVarietyById(row.properties.variety_id)?.name,
        sortable: true,
      },
      {
        name: 'ready_to_pick',
        label: t('tree.ready_to_pick'),
        align: 'left',
        field: (row: Tree): string | undefined =>
          getVarietyById(row.properties.variety_id)?.ready_to_pick,
        sortable: true,
      },
      {
        name: 'state',
        label: t('tree.state'),
        align: 'left',
        field: (row: Tree): string => row.properties.state,
      },
      {
        name: 'last_cut',
        label: t('tree.last_cut'),
        align: 'left',
        field: (row: Tree): Date | undefined => row.properties.last_cut,
        format: (val: Date | undefined): string | undefined =>
          val === undefined ? undefined : d(val, 'short'),
        sortable: true,
      },
      {
        name: 'last_fertilization',
        label: t('tree.last_fertilization'),
        align: 'left',
        field: (row: Tree): Date | undefined => row.properties.last_fertilization,
        format: (val: Date | undefined): string | undefined =>
          val === undefined ? undefined : d(val, 'short'),
        sortable: true,
      },
    ];
    const rowEnter = (id: number): void => {
      emit('TreeHovered', id);
    };
    const rowLeft = (): void => {
      emit('TreeHovered', undefined);
    };
    const filteredTrees = computed<Tree[]>(() => {
      if (props.trees === undefined) return [];
      if (filter.value === '') return props.trees;
      return props.trees.filter(
        (tree) =>
          getVarietyById(tree.properties.variety_id)
            ?.name.toLowerCase()
            .includes(filter.value.toLowerCase()) === true,
      );
    });
    watch(
      () => props.trees,
      () => {
        filter.value = '';
      },
      { immediate: true },
    );

    return {
      columns,
      filter,
      filteredTrees,
      getSpeciesColorByTreeId,
      rowEnter,
      rowLeft,
    };
  },
});
</script>

<template>
  <q-breadcrumbs gutter="md" class="text-h6 q-pb-md" separator="|">
    <q-breadcrumbs-el
      icon="mdi-tree"
      :label="$t('terminology.variety', 2)"
      :to="{ name: 'variety-list' }"
    />
  </q-breadcrumbs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

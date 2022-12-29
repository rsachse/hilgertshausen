<template>
  <q-dialog v-model="card" position="right">
    <q-card class="my-card" style="width: 350px">
      <div v-if="selectedMapTree?.images.length > 1">
        <q-carousel
          animated
          v-model="slide"
          arrows
          navigation
          infinite
          :autoplay="autoplay"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = true"
        >
          <q-carousel-slide
            v-for="(image, index) in selectedMapTree?.images"
            :key="index"
            :img-src="image"
            :name="index"
          />
        </q-carousel>
      </div>
      <div v-else-if="selectedMapTree?.images.length === 1">
        <q-img :src="selectedMapTree?.images[0]" />
      </div>
      <div v-else>
        <q-img src="noexistent">
          <template v-slot:error>
            <div class="absolute-full flex flex-center">
              <h6>{{ $t('tree.no_image') }}</h6>
            </div>
          </template>
        </q-img>
      </div>

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ selectedMapTree?.variety.name }}</div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
          {{ $t('tree.tree_id') }}: {{ selectedMapTree?.tree.properties.id }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 600px"
    class="shadow-2"
  >
    <ol-view ref="view" projection="EPSG:3857" :minZoom="14" :maxZoom="19"> </ol-view>

    <ol-tile-layer>
      <ol-source-osm url="/tiles/{z}/{x}/{y}.png" />
    </ol-tile-layer>
    <ol-attribution-control />

    <ol-overlay :position="selectedMapTree.coordinates" v-if="selectedMapTree !== undefined">
      <template>
        <div class="overlay-content">{{ selectedMapTree }}</div>
      </template>
    </ol-overlay>

    <ol-interaction-select
      @select="featureSelected"
      :condition="singleClick"
      :filter="selectInteractionFilter"
    >
      <ol-style>
        <ol-style-text
          :text="String.fromCodePoint(0xf0531)"
          font='normal normal 400 24px "Material Design Icons"'
          :scale="2"
        >
          <ol-style-fill :color="selectedMapTree?.color" />
          <ol-style-stroke color="black" :width="3" />
        </ol-style-text>
      </ol-style>
    </ol-interaction-select>

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature
          v-for="tree in mapTrees"
          :key="tree.tree.properties.id"
          :properties="{ tree: tree, id: tree.tree.properties.id }"
        >
          <ol-geom-point :coordinates="tree.coordinates" />
          <ol-style>
            <ol-style-text
              :text="String.fromCodePoint(0xf0531)"
              font='normal normal 400 24px "Material Design Icons"'
              :scale="tree.tree.properties.id === highlightedTreeId ? 2 : 1"
            >
              <ol-style-fill :color="tree.color" />
              <ol-style-stroke color="black" :width="3" />
            </ol-style-text>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script lang="ts">
import type { Position } from 'geojson';
import type Feature from 'ol/Feature';
import type View from 'ol/View';
import { singleClick } from 'ol/events/condition';
import { MultiPoint } from 'ol/geom';
import type { SelectEvent } from 'ol/interaction/Select';
import { fromEPSG4326 } from 'ol/proj/epsg3857';
import { colors } from 'quasar';
import { computed, defineComponent, ref, watch, type PropType } from 'vue';

const { getPaletteColor } = colors;

import type { Tree } from '@/models/Tree';
import type { Variety } from '@/models/Variety';
import { getSpeciesColorByTreeId } from '@/utils/colors';
import { getTreeImages } from '@/utils/trees';
import { getVarietyById } from '@/utils/varieties';

interface MapTree {
  tree: Tree;
  color: string;
  coordinates: Position;
  images: string[];
}
interface SelectedMapTree extends MapTree {
  images: string[];
  variety: Variety;
}

export default defineComponent({
  props: {
    trees: {
      type: Array as PropType<Tree[]>,
      required: true,
    },
    highlightedTreeId: Number,
  },
  setup(props) {
    const mapTrees = computed<MapTree[]>(() => {
      return props.trees
        .filter((tree) => tree.geometry !== null)
        .map((tree) => {
          return {
            tree,
            color: getPaletteColor(getSpeciesColorByTreeId(tree.properties.id)),
            coordinates: fromEPSG4326(tree.geometry.coordinates),
          };
        });
    });
    const slide = ref(0);
    const autoplay = ref(true);
    const card = ref(false);
    const view = ref<View | null>(null);
    const selectedMapTree = ref<SelectedMapTree | undefined>(undefined);

    const featureSelected = (event: SelectEvent): void => {
      console.log('Event');
      console.log(event);
      if (event.selected.length > 0) {
        const mapTree = event.selected[0].get('tree') as MapTree;
        selectedMapTree.value = {
          ...mapTree,
          images: getTreeImages(mapTree.tree.properties.id),
          variety: getVarietyById(mapTree.tree.properties.variety_id) as Variety,
        };
        card.value = true;
        slide.value = 0;
        autoplay.value = true;
      } else {
        selectedMapTree.value = undefined;
        card.value = false;
      }
    };
    const selectInteractionFilter = (feature: Feature): boolean => {
      console.log('Filter');
      console.log(feature.getProperties());
      return true;
    };
    const fitToView = (): void => {
      if (mapTrees.value.length > 0 && view.value !== null)
        view.value.fit(new MultiPoint(mapTrees.value.map((tree) => tree.coordinates)), {
          padding: [100, 100, 100, 100],
        });
    };
    watch(mapTrees, fitToView, { immediate: true });
    watch(view, fitToView, { immediate: true });
    watch(card, (newValue) => {
      // funktioniert nicht
      console.log(newValue);
      if (newValue === false) selectedMapTree.value = undefined;
    });

    return {
      mapTrees,
      selectedMapTree,
      getSpeciesColorByTreeId,
      getPaletteColor,
      singleClick,
      featureSelected,
      selectInteractionFilter,
      view,
      card,
      slide,
      autoplay,
    };
  },
});
</script>

<style>
.q-dialog__inner--right {
  right: 23px !important;
}
</style>

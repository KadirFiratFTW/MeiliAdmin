<template>
  <div class="column is-one-quarter" v-if="indexData">
    <div class="card has-background-danger">
      <div class="card-content has-text-white">
        <h1 class="is-size-5 is-bold">{{ indexName }}</h1>

        <div class="content is-size-6">
          <span class="tag is-primary mt-2">{{ $t("documents") }} : {{ indexData.numberOfDocuments }}</span>

          <br />
          <span class="tag is-primary mt-2">{{ $t("is_indexing") }} :
            {{
              indexData.isIndexing ? $t("processing") : $t("processed")
            }}</span>
          <router-link :to="'/indexes/' + this.$route.params.server + '/' + indexName">
            <b-tooltip :label="i18('index.delete')" class="float-right" position="is-top">
              <b-button type="is-dark" class="ml-1"><b-icon icon="cog" size="is-small"> </b-icon></b-button>
            </b-tooltip>
          </router-link>
          <b-tooltip :label="i18('index.settings')" class="float-right" position="is-top">
              <b-button type="is-warning" @click="isDeleteIndexModalActive = true"><b-icon icon="eraser" size="is-small"> </b-icon></b-button>
            </b-tooltip>
        </div>
      </div>
    </div>
    <b-modal
      v-model="isDeleteIndexModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    >
      <div class="modal-card" style="width: 450px">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t("index.delete") }}</p>
          <button
            type="button"
            class="delete"
            @click="isDeleteIndexModalActive = false"
          />
        </header>
        <section class="modal-card-body">
         
          <b-button expanded type="is-danger my-4"
            >{{ $t('index.delete') }}</b-button
          >
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    indexName: null,
    indexData: null,
  },
  methods: {
    i18(param){
      return this.$t(param);
    }
  },  
  data: () => {
    return {
      isDeleteIndexModalActive: false,
    };
  },
  mounted() { },
};
</script>

<style scoped>
.server-header {
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.server-header>span {
  margin-left: 10px;
  margin-top: 5px;
}

.float-right {
  float: right;
}
</style>
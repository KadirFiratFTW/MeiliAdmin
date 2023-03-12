<template>
  <div>
    <b-button :disabled="serverInfo == null" type="is-info my-4" @click="isComponentModalActive = true">{{
      $t("create_new_index")
    }}</b-button>
    <div class="columns" v-if="Object.keys(serverIndexList).length">
      <IndexVue
        v-for="(index, i) in Object.keys(serverIndexList)"
        :key="i"
        :indexName="index"
        :indexData="Object.values(serverIndexList)[i]"
      />
    </div>
    <div v-if="!Object.keys(serverIndexList).length">
      <article class="message is-danger">
        <div class="message-header">
          <p>{{ $t("error") }}</p>
        </div>
        <div class="message-body">
          <strong>{{ $t("no_index_list_or_offline") }}</strong>
        </div>
      </article>
    </div>
    <b-modal
      v-model="isComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    >
      <div class="modal-card" style="width: 450px">
        <header class="modal-card-head">
          <p class="modal-card-title">İndex Oluştur</p>
          <button
            type="button"
            class="delete"
            @click="isComponentModalActive = false"
          />
        </header>
        <section class="modal-card-body">
          <b-message type="is-danger" v-if="errorMsg.length">
            {{ errorMsg }}
          </b-message>

          <b-field label="İndex Adı">
            <b-input
              v-model="createIndex.name"
              placeholder="ex: movies"
            ></b-input>
          </b-field>
          <b-field class="file">
            <b-upload v-model="createIndex.file" expanded>
              <a class="button is-primary is-fullwidth">
                <span>{{ createIndex.file.name || "Tıkla ve Dosya Seç" }}</span>
              </a>
            </b-upload>
          </b-field>

          <b-button expanded type="is-info my-4" @click="uploadIndex()"
            >Yükle</b-button
          >
        </section>
      </div>
    </b-modal>
  </div>
</template>
<script>
import IndexVue from "./Index.vue";
export default {
  components: {
    IndexVue,
  },
  name: "ServerIndexes",
  sockets: {
    connect: function () {
      console.log("MeiliSocket connected");
    },
  },
  methods: {
    fetchServer(){
      this.serverInfoInterval = setInterval(() => {
        this.$socket.emit("getServerInfo", this.$route.params.server);
      }, 1000)
    },
    uploadIndex() {
      if (!this.createIndex.file.name.endsWith(".json")) {
        this.errorMsg = this.$t("only_json");
        return;
      }
      const uploadedFile = this.createIndex.file;
      const indexName = this.createIndex.name;
      const serverIp = this.serverInfo.server_ip;
      const serverPort = this.serverInfo.port;
      const serverProtocol = this.serverInfo.protocol;
      const reader = new FileReader();

      reader.readAsText(uploadedFile, "UTF-8");
      reader.onload = (evt) => {
        const rawJSON = evt.target.result;

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: rawJSON,
        };

        fetch(
          `${serverProtocol}://${serverIp}:${serverPort}/indexes/${indexName}/documents`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            const resp = JSON.parse(result);
            if(resp.status){
              this.$notify({
                title: this.$t('index_creation.success_title'),
                text: this.$t('index_creation.success_msg'),
                type: 'success'
              });
            }
          })
          .catch((error) => console.log("error", error));
      };
      this.isComponentModalActive = false;
    },
    startInterval() {
      this.$socket.emit("server_indexes", this.$route.params.server);
      setInterval(() => {
        this.$socket.emit("server_indexes", this.$route.params.server);
      }, 5000);
    },
  },
  mounted() {
    this.fetchServer();
    this.startInterval();
    this.sockets.subscribe("server_indexes", (data) => {
      this.serverIndexList = data;
    });
    this.sockets.subscribe("resServerInfo", (data) => {
        this.serverInfo = data;
        this.sockets.unsubscribe("resServerInfo")
        clearInterval(this.serverInfoInterval);
        this.serverInfoInterval = null;
    });
  },
  data: () => {
    return {
      serverInfo: null,
      serverInfoInterval: null,
      errorMsg: "",
      createIndex: {
        name: "",
        file: {
          name: "",
        },
      },
      isComponentModalActive: false,
      serverIndexList: [],
    };
  },
};
</script>
<style scoped>
.columns {
  flex-wrap: wrap;
}
</style>
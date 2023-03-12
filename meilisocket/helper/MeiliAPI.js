
import { MeiliSearch } from 'meilisearch'
const instances = [];

export default {

    getServerInstance(server, protocol, port) {
        if (!server || !protocol || !port) return;
        const findServer = instances.find(S => S.ip == server && S.port == port);
        if (!findServer) return this.handshakeServer(server, protocol, port);
        return findServer.meili;
    },

    async checkHealth(server, protocol, port) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const healthStatus = await ServerInstance.health();
            return healthStatus.status == 'available' ? true : false;
        } catch (error) {
            return false;
        }
    },

    async checkStats(server, protocol, port) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const stats = await ServerInstance.getStats();
            const indexCount = Object.keys(stats.indexes).length;
            const indexInfo = Object.values(stats.indexes);
            const getVersion = await ServerInstance.getVersion();
            let totalDocuments = 0;
            for (let doc = 0; doc < indexCount; doc++) {
                const pickDocuments = indexInfo[doc]
                totalDocuments += pickDocuments.numberOfDocuments;
            }
            return { indexCount, totalDocuments, size: stats.databaseSize, version: getVersion.pkgVersion  }
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    async getIndexList(server, protocol, port) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const stats = await ServerInstance.getStats();
            return stats.indexes;
        } catch (error) {
            return [];
        }
    },

    async getIndexSettings(server, protocol, port, index) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = await ServerInstance.index(index).getSettings()
            return settings;
        } catch (error) {
            return {};
        }
    },

    setDisplayAttr(server, protocol, port, index, attr) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).updateDisplayedAttributes(attr)
            return true;
        } catch (error) {
            return false;
        }
    },

    resetDisplayAttr(server, protocol, port, index) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).resetDisplayedAttributes()
            return true;
        } catch (error) {
            return false;
        }
    },

    setSearchAttr(server, protocol, port, index, attr) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).updateSearchableAttributes(attr)
            return true;
        } catch (error) {
            return false;
        }
    },

    setFilterAttr(server, protocol, port, index, attr) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).updateFilterableAttributes(attr)
            return true;
        } catch (error) {
            return false;
        }
    },

    setRankingAttr(server, protocol, port, index, attr) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).updateRankingRules(attr)
            return true;
        } catch (error) {
            return false;
        }
    },

    setStopWordsAttr(server, protocol, port, index, attr) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).updateStopWords(attr)
            return true;
        } catch (error) {
            return false;
        }
    },

    resetStopWordsAttr(server, protocol, port, index) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).resetStopWords()
            return true;
        } catch (error) {
            return false;
        }
    },

    resetSearchAttr(server, protocol, port, index) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).resetSearchableAttributes()
            return true;
        } catch (error) {
            return false;
        }
    },

    resetRankingAttr(server, protocol, port, index) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).resetRankingRules()
            return true;
        } catch (error) {
            return false;
        }
    },

    resetFilterAttr(server, protocol, port, index) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).resetFilterableAttributes()
            return true;
        } catch (error) {
            return false;
        }
    },

    updateSynonyms(server, protocol, port, index, attr) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).updateSynonyms(attr)
            return true;
        } catch (error) {
            return false;
        }
    },

    updateDistinct(server, protocol, port, index, attr) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).updateDistinctAttribute(attr)
            return true;
        } catch (error) {
            return false;
        }
    },


    resetSynonyms(server, protocol, port, index) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).resetSynonyms()
            return true;
        } catch (error) {
            return false;
        }
    },

    resetDistinct(server, protocol, port, index) {
        if (!server || !protocol || !port) return;
        const ServerInstance = this.getServerInstance(server, protocol, port);
        try {
            const settings = ServerInstance.index(index).resetDistinctAttribute()
            return true;
        } catch (error) {
            return false;
        }
    },

    handshakeServer(host, protocol, port) {
        if (!host || !protocol || !port) return;
        const createServerAddr = `${protocol}://${host}:${port}`
        const CreateInstance = new MeiliSearch({
            host: createServerAddr
        })
        instances[instances.length] = { meili: CreateInstance, ip: host, port };
        return CreateInstance;
    }


}
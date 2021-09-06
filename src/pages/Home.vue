<template>
  <div class="wrapper-content wrapper-content--fixed">
    <section>
      <div class="container">
        <!-- errrors -->
        <div class="error" v-if="error" style="margin-bottom: 20px">
          <p>{{ error }}</p>
        </div>

        <!-- search bar -->
        <search
          :value="search"
          placeholder="Type username..."
          @search="search = $event"
        />

        <!-- button -->
        <div class="btn__wrapper">
          <button
            v-if="!repos"
            class="btn btnPrimary"
            @click="getUserInfoAndRepos"
          >
            Search!
          </button>
          <button v-else class="btn btnPrimary" @click="getUserInfoAndRepos">
            Search Again!
          </button>
        </div>
        <!-- wrapper repos -->
        <div class="user-info" v-if="userInfo">
          <div class="user-info__ava">
            <div class="ava">
              <img :src="userInfo.avatar_url" alt="" />
            </div>
          </div>
          <div class="user-info__name">
            <div class="title">
              {{ userInfo.name }}
            </div>
          </div>
          <div class="user-info__count-rep">
            <span class="small-text">Repos:</span>
            {{ userInfo.public_repos }}
          </div>
        </div>
        <div class="repos__wrapper" v-if="filteredRepos">
          <div class="repos__header">
            <div
              class="repos__name"
              @click="
                 changeFilterSettings('name')
              "
            >
              Name
            </div>
            <div class="repos__stars"  @click="
                changeFilterSettings('stargazers_count')
              ">
              Stars
            </div>
          </div>
          <!-- item -->
          <div class="repos__item" v-for="repo in filteredRepos" :key="repo.id">
            <div class="repos__info">
              <a class="link" :href="repo.html_url" target="_blank">{{
                repo.name
              }}</a>
              <span>{{ repo.stargazers_count }} ⭐</span>
            </div>
          </div>
          <!-- preloader -->
          <div class="preloader__wrapper"  v-if="isLoading" >
            <preloader width="90" height="90" />
          </div>

          <div class="loadmore">
            <button class="btn btnPrimary" @click="loadMore" v-if="countPagesRepos > currentPageUrl">
              Load More
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import search from "@/components/Search.vue"
import axios from "axios"

// UI
import preloader from "@/components/UI/Preloader.vue"

export default {
  components: {
    search, preloader
  },
  data() {
    return {
      search: "",
      repos: null,
      error: null,
      userInfo: null,
      sortNameOfRepos: "asc",
      sortBy: "name",
      isLoading: false,
      currentPageUrl: 1,
      countPagesRepos: '',
      perPageRepos: 30
    }
  },
  computed: {
    filteredRepos() {
      if (this.repos === null) return
      let sortBy = this.sortBy,
          sortNameOfRepos = this.sortNameOfRepos

      return this.repos.sort((a, b) => {
        if (sortNameOfRepos === "asc") {
          if (a[sortBy] < b[sortBy]) return -1
          if (a[sortBy] > b[sortBy]) return 1
          return 0
        }

        if (sortNameOfRepos === "desc") {
          if (a[sortBy]< b[sortBy]) return 1
          if (a[sortBy] > b[sortBy]) return -1
          return 0
        }
      })
    },
  },
  methods: {
    getUserInfoAndRepos() {
      this.isLoading = true

      axios
        .all([
          axios.get(`https://api.github.com/users/${this.search}`),
          axios.get(`https://api.github.com/users/${this.search}/repos?page=${this.currentPageUrl}&per_page=${this.perPageRepos}`),
        ])
        .then(
          axios.spread((res1, res2) => {
            this.userInfo = {}
            this.error = null

            let avatar_url = res1.data.avatar_url,
              name = res1.data.name,
              public_repos = res1.data.public_repos

            this.userInfo.avatar_url = avatar_url
            this.userInfo.name = name
            this.userInfo.public_repos = public_repos

            this.countPagesRepos = public_repos / this.perPageRepos

            this.repos = res2.data
          })
        )
        .catch(() => {
          this.userInfo = null
          this.repos = null
          this.error = "Can`t get find this user"
        })
        .finally(() => {
          this.isLoading = false
        })
    },
     changeFilterSettings(name) {
       this.sortBy = name
      
      if ( this.sortNameOfRepos === 'asc' ) 
        this.sortNameOfRepos = 'desc'
      else 
        this.sortNameOfRepos =  'asc'
     },
     loadMore() {
       this.isLoading = true

       this.currentPageUrl++
       axios.get(`https://api.github.com/users/${this.search}/repos?page=${this.currentPageUrl}&per_page=${this.perPageRepos}`).then(res => {
          this.repos.push.apply(this.repos, res.data);
       }).catch((e) => {
         this.error = e
       }).finally(()=> {
          this.isLoading = false
       })
     }
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.btn__wrapper {
  margin-top: 25px;
  display: grid;
  place-items: center;
}
.repos__wrapper {
  width: 400px;
  margin: 30px 0;
}
.repos__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #dbdbdb;
}
.user-info__ava {
  width: 50px;
  height: 50px;
}
.user-info {
  margin-top: 30px;
  width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  margin-bottom: 0;
}
.small-text {
  font-size: 11px;
  font-weight: normal;
}
.user-info__count-rep {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.repos__header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dbdbdb;
  font-weight: bold;
  padding-bottom: 15px;
  margin-top: 20px;
}
.repos__name,
.repos__stars {
  cursor: pointer;
}
.loadmore {
  text-align: center;
  margin-top: 20px;
}
.preloader__wrapper {
  display: flex;
  justify-content: center;
  padding: 51px;
}
</style>

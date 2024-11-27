<template>
  <div id="app">
    <router-view></router-view>

    <transition
    name="snackbar-transition"
    @before-enter="beforeEnter"
    @after-leave="afterLeave"
  >
    <div v-if="showSnackbar && snackbar"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white p-4 rounded-lg shadow-lg w-80"
      :class="snackbar.mode === 'success' ? 'bg-green-500' : 'bg-red-500'"
    >
      <div class="flex items-center justify-center">
        <div>
          <span class="font-bold" v-if="snackbar.mode !== 'success'">Oops!</span>
          <span>{{ snackbar.message }}</span>
        </div>

        <button v-if="snackbar.buttonText" @click="clickSnackBarButton(snackbar.buttonText)"
          class="text-white ml-4 font-bold">
          {{ snackbar.buttonText }}
        </button>
      </div>
    </div>
  </transition>
</div>

</template>

<script>
import { useSnackbarStore } from './stores/snackbar';

export default {
  name: 'App',
  data() {
    return {
      showSnackbar: false,
    };
  },
  computed: {
    snackbar() {
      const snackbarStore = useSnackbarStore();
      return snackbarStore.snackbar;
    },
  },
  methods: {
    clickSnackBarButton(value) {
      if (value === 'Undo') {
      }
      const snackbarStore = useSnackbarStore();
      snackbarStore.clearSnackbar();
    },
  },
  watch: {
    snackbar(newSnackbar) {
      if (newSnackbar && newSnackbar.message) {
        this.showSnackbar = true;
        setTimeout(() => {
          this.showSnackbar = false;
        }, newSnackbar.duration);
      } else {
        this.showSnackbar = false;
      }
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
}

.snackbar-text--fail {
  color: red;
}

.snackbar-text--success {
  color: green;
}

.snackbar-transition-enter-active,
.snackbar-transition-leave-active {
  transition: opacity 1.5s ease, transform 1.5s ease;
}

.snackbar-transition-enter-from,
.snackbar-transition-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(30px);
}

.md-button {
  text-transform: none !important;
  overflow: visible !important;
}

.md-app.md-fixed .md-app-scroller {
  overflow: unset !important;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

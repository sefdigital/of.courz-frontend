<template>
  <div class="pb-4">
    <div ref="firebaseui"></div>
    <p class="text-text-gray p-1 text-center text-xs">
      Mit der Anmeldung akzeptierst du unsere
      <g-link to="/privacy/" class="text-primary">Datenschutzerklärung</g-link>.
    </p>
    <p v-if="badInitialized" class="text-black p-1">Seite bitte neuladen, es ist ein Fehler aufgetreten</p>
  </div>
</template>
<script>
import { smallBreakpoint } from "../../plugins/responsive";
import { authenticationStoreComputers } from "../../stores/authentication";

export default {
  props: {
    desktop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      badInitialized: false
    }
  },
  computed: {
    ...authenticationStoreComputers
  },
  watch: {
    firebaseUser(user) {
      if (!user)
        import("../../plugins/firebase/firebase-ui").then(({ ui, uiConfig }) => {
          ui.start(this.$refs.firebaseui, uiConfig);
        });
    }
  },
  mounted() {
    this.badInitialized = (this.desktop && smallBreakpoint()) || (!this.desktop && !smallBreakpoint());

    if (this.badInitialized)
      return;

    import("firebaseui/dist/firebaseui.css")
    import("../../plugins/firebase/firebase-ui").then(({ ui, uiConfig }) => {
      ui.start(this.$refs.firebaseui, uiConfig);
    });
  },
};
</script>
<style lang="scss">
.firebaseui-container {
  @apply rounded;
}

.w-360px {
  min-width: 16rem;
  width: 16rem;
  max-width: 100%;
}

.mdl-shadow--2dp {
  box-shadow: unset !important;
}
</style>
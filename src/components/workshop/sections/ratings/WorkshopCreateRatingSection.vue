<template>
  <form v-if="visible" @submit.prevent="submit">

    <div v-show="state !== 2">
      <h3 class="h4 mb-6">Bewerte den Kurs</h3>

      <p class="font-bold">Der Kursleiter...</p>
      <div class="pl-6">
        <RatingSection v-model="form.organizerRating.friendly" class="mt-3">
          verhält sich immer freundlich und höflich gegenüber den Teilnehmern.
        </RatingSection>

        <RatingSection v-model="form.organizerRating.reliable" class="mt-3">
          ist zuverlässig und pünktlich.
        </RatingSection>

        <RatingSection v-model="form.organizerRating.knowledge" class="mt-3">
          beherrscht das Thema und kann es gut vermitteln.
        </RatingSection>

        <RatingSection v-model="form.organizerRating.patience" class="mt-3">
          ist immer geduldig bei Fragen oder Schwierigkeiten.
        </RatingSection>

        <RatingSection v-model="form.organizerRating.rating" class="mt-3" type="stars">
          bekommt die Bewertung:
        </RatingSection>
      </div>

      <p class="font-bold mt-8">Der Kurs...</p>
      <div class="pl-6">
        <RatingSection v-model="form.workshopRating.recommendable" class="mt-3">
          ist grundsätzlich weiterzuempfehlen.
        </RatingSection>

        <RatingSection v-model="form.workshopRating.content" class="mt-3">
          enthält eine angemessene Inhalts-Dichte.
        </RatingSection>

        <RatingSection v-model="form.workshopRating.entertaining" class="mt-3">
          ist nie langweilig.
        </RatingSection>

        <RatingSection v-model="form.workshopRating.rating" class="mt-3" type="stars">
          bekommt die Bewertung:
        </RatingSection>
      </div>

      <input-template v-model="form.text" label="Deine Meinung ist gefragt. Wirklich!" type="textarea"/>
      <input-template v-model="form.improveable" :label="`Was könnte ${workshop.organizer.firstName} verbessern?`"
                      type="textarea"/>
    </div>

    <!-- button with loading indicator -->
    <button :class="{'mt-4' : state !== 2}" :disabled="state === 1 || state === 2" class="primary-button w-full">
      <span v-if="state === 0">Abschicken</span>
      <Spinner v-else-if="state === 1" class="mx-auto"/>
      <span v-else-if="state === 2">Erfolgreich abgeschickt, Kachel schließt sich</span>
      <span v-else-if="state === 3">Erneut versuchen</span>
    </button>

  </form>
</template>
<script>
import InputTemplate from "../../../gui-elements/InputTemplate";
import Spinner from "../../../gui-elements/Spinner";
import SliderInput from "./components/SliderInput";
import RatingSection from "./components/RatingSection";
import gql from "graphql-tag";

export default {
  props: ["workshop"],
  data() {
    return {
      state: 0, // 0 = waiting, 1 = saving, 2 = done, 3 = error
      form: {

        organizerRating: {
          friendly: null,
          reliable: null,
          knowledge: null,
          patience: null,
          rating: 0,
        },

        workshopRating: {
          recommendable: null,
          content: null,
          entertaining: null,
          rating: 0
        },

        text: "",
        improveable: ""
      }
    }
  },
  methods: {
    submit() {
      this.state = 1;

      const self = this;

      const mutation = gql`
        mutation ($workshop: ObjectId!, $rating: RatingInput!) {
          addRating(workshop: $workshop, rating: $rating) {
            text
            improveable
            author {firstName}
            organizerRating {friendly reliable knowledge patience rating}
            workshopRating { recommendable content entertaining rating}
          }
        }`;

      this.$backend.request(mutation, {
        workshop: this.workshop._id,
        rating: this.form
      }).then(({ addRating: rating }) => {
        self.state = 2;
        self.workshop.ratings.push({
          ...rating,
          author: this.$store.state.authentication.user
        })
        setTimeout(() => self.$emit('finish', rating), 1000);
      }).catch(() => self.state = 3);

    }
  },
  computed: {
    workshopOrder() {
      const self = this;

      for (const order of this.$store.state.orders.orders) {
        if (order.status === 'PAYED' && order.workshop._id.localeCompare(self.workshop._id) === 0)
          return order;
      }

      return null;
    },
    bookingStarted() {
      if (!this.workshopOrder)
        return null;

      return this.workshopOrder.event.dates[0].startTime < Date.now()
    },
    notRatedYet() {
      if (!this.workshopOrder)
        return true;

      for (const rating in this.workshop.ratings) {
        if (rating.author?._id === this.$store.state.authentication.firebaseUser?.id)
          return false;
      }

      return true;
    },
    visible() {
      return !!this.bookingStarted && this.notRatedYet;
    }
  },
  components: { RatingSection, SliderInput, InputTemplate, Spinner }
}
</script>
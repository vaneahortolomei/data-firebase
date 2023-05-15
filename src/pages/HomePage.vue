<template>
  <div class="grid">
    <div class="grid__form">
      <form action="#" class="form" @submit.prevent="sendData">
        <div class="form__group">
          <Input
            id="name"
            v-model="v$.name.$model"
            label="Name"
            type="text"
            name="name"
            @blur="v$.name.$touch"
          />

          <span
            v-for="(error, index) in v$.name.$errors"
            :key="index"
            class="form__error"
          >
            {{ error.$message }}
          </span>
        </div>

        <div class="form__group">
          <Input
            id="email"
            v-model="v$.email.$model"
            label="Email"
            type="text"
            name="email"
            @blur="v$.email.$touch"
          />

          <span
            v-for="(error, index) in v$.email.$errors"
            :key="index"
            class="form__error"
          >
            {{ error.$message }}
          </span>
        </div>

        <button type="submit" class="button">Submit</button>
      </form>
    </div>
    <div class="grid__list">
      <Input
        id="search"
        v-model="searching"
        label="search"
        type="text"
        name="search"
        style="margin-bottom: 50px"
      />

      <transition-group name="fade" tag="ul" class="list">
        <li
          v-for="(user, index) in filteredList"
          :key="user"
          class="list__item"
        >
          {{ user.id }}
          {{ index }}
          {{ user.name }}
          {{ user.email }}
          <button type="button" class="button" @click="removeItem(user.id)">
            Delete
          </button>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import Input from "../components/form/InputComponent.vue";
import { computed, reactive, ref } from "vue";
import { email, minLength, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

import { useFirestore, useCollection } from "vuefire";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";

const state = reactive({
  name: "",
  email: "",
});

const rules = computed(() => ({
  name: {
    required,
    minLength: minLength(2),
    $lazy: true,
  },
  email: {
    required,
    email,
    $lazy: true,
  },
}));

const db = useFirestore();
const users = useCollection(collection(db, "users"));

const searching = ref("");

const usersList = computed(() => {
  return reactive(users.value);
});

const filteredList = computed(() => {
  return usersList.value.filter((user) =>
    user.name.includes(searching.value.toLowerCase()),
  );
});

const removeItem = async (id) => {
  await deleteDoc(doc(db, "users", id));
};

const v$ = useVuelidate(rules, state);

const sendData = () => {
  v$.value
    .$validate()
    .then(async (valid) => {
      if (!valid) {
        return;
      }
      await addDoc(collection(db, "users"), {
        name: state.name,
        email: state.email,
      });
    })
    .catch((e) => {
      return e;
    })
    .finally(() => "data");
};
</script>
